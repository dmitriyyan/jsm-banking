import Account from '@/types/Account';
import CountUp from '@/components/CountUp';
import DoughnutChart from '@/components/DoughnutChart';

type TotalBalanceBoxProps = {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
};

export default function TotalBalanceBox({
  accounts,
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <div className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-chart sm:gap-6 sm:p-6;">
      <div className="flex size-full max-w-[100px] items-center sm:max-w-[120px]">
        <DoughnutChart accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Bank Accounts: {totalBanks}
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">
            Total Current Balance
          </p>
          <div className="text-2xl lg:text-30 flex-1 font-semibold text-gray-900 flex items-center justify-center gap-2">
            <CountUp end={totalCurrentBalance} prefix="$" duration={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
