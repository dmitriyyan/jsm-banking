import { HeaderBox } from '@/components/HeaderBox';
import { TotalBalanceBox } from '@/components/TotalBalanceBox';

export default function Home() {
  const user = { firstName: 'User' };

  return (
    <div className="no-scrollbar flex w-full max-xl:max-h-screen max-xl:overflow-y-scroll">
      <div className="no-scrollbar flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
        <header className="flex flex-col justify-between gap-8">
          <HeaderBox
            type="greeting"
            title="Welcome"
            name={user?.firstName}
            subtext="Access and manage your account and transactions efficiently."
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.34}
          />
        </header>
      </div>
    </div>
  );
}
