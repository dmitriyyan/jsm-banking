import { HeaderBox } from '@/components/HeaderBox';
import { TransactionsTable } from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

export default async function Transactions({
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
    <section className="flex max-h-screen w-full flex-col gap-8 overflow-y-scroll bg-gray-25 p-8 xl:py-12">
      <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row">
        <HeaderBox
          title="Transactions"
          subtext="See your bank details and transactions"
        />
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-lg border-y bg-blue-600 px-4 py-5 md:flex-row">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-white">
                {account.data.name}
              </h2>
              <p className="text-lg text-blue-25">
                {account.data.officialName}
              </p>
            </div>
            <p className="text-xs font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●●{' '}
              <span className="text-base">{account.data.mask}</span>
            </p>
            <div
              className="flex items-center justify-center flex-col gap-2 rounded-md
            bg-blue-25/20 px-4 py-2 text-white"
            >
              <p className="text-sm">Current balance</p>
              <p className="text-3xl font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                }).format(account.data.currentBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-6">
        <TransactionsTable transactions={account.transactions} />
      </div>
    </section>
  );
}
