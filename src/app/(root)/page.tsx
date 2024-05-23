import { HeaderBox } from '@/components/HeaderBox';
import { RecentTransactions } from '@/components/RecentTransactions';
import { RightSidebar } from '@/components/RightSidebar';
import { TotalBalanceBox } from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { Account } from '@/types/Account';
import { Bank } from '@/types/Bank';

export default async function Home({
  searchParams: { id, page },
}: {
  searchParams: { id: string; page: string };
}) {
  const user = await getLoggedInUser();
  const accounts = await getAccounts({ userId: user.$id });
  if (!accounts) {
    return null;
  }

  const appwriteItemId = id || accounts.data[0].appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  const currentPage = page ? parseInt(page, 10) : 1;

  return (
    <div className="no-scrollbar flex w-full max-xl:max-h-screen max-xl:overflow-y-scroll">
      <div className="no-scrollbar flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
        <header className="flex flex-col justify-between gap-8">
          <HeaderBox
            type="greeting"
            title="Welcome"
            name={`${user.firstName} ${user.lastName}`}
            subtext="Access and manage your account and transactions efficiently."
          />
          <TotalBalanceBox
            accounts={accounts.data}
            totalBanks={accounts.totalBanks}
            totalCurrentBalance={accounts.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          transactions={account.transactions}
          accounts={accounts.data}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <RightSidebar
        user={user}
        transactions={account.transactions}
        banks={accounts.data.slice(0, 2) as Bank[] & Account[]}
      />
    </div>
  );
}
