'use client';
import { Account } from '@/types/Account';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type DoughnutChartProps = {
  accounts: Account[];
};

export function DoughnutChart({ accounts }: DoughnutChartProps) {
  const accountNames = accounts.map((account) => account.name);
  const accountBalances = accounts.map((account) => account.currentBalance);
  const data = {
    datasets: [
      {
        label: 'Banks',
        data: accountBalances,
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
      },
    ],
    labels: accountNames,
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: '60%',
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}
