import { BankCard } from '@/components/BankCard';
import { HeaderBox } from '@/components/HeaderBox';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { Account } from '@/types/Account';

export default async function MyBanks() {
  const user = await getLoggedInUser();
  const accounts = await getAccounts({ userId: user.$id });

  return (
    <section className="flex">
      <div className="flex h-screen max-h-screen w-full flex-col gap-8 bg-gray-25 p-8 xl:py-12">
        <HeaderBox
          title="My Banks"
          subtext="Effortlessly manage your banking activities"
        />
        <div className="space-y-4">
          <h2 className="text-18 font-semibold text-gray-900">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts?.data.map((a: Account) => (
              <BankCard
                key={a.id}
                account={a}
                userName={user.firstName}
                showBalance
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
