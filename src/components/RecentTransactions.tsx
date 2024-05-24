import { Account } from '@/types/Account';
import { Transaction } from '@/types/Transaction';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BankTabItem } from './BankTabItem';
import { BankInfo } from './BankInfo';
import { TransactionsTable } from './TransactionsTable';
import { Pagination } from './Pagination';

type RecentTransactionsProps = {
  accounts: Account[];
  transactions: Transaction[];
  appwriteItemId: string;
  page: number;
};

export function RecentTransactions({
  transactions,
  accounts,
  appwriteItemId,
  page,
}: RecentTransactionsProps) {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl md:text-24 font-semibold text-gray-900">
          Recent Transactions
        </h2>
        <Link
          href={`/transactions/?id=${appwriteItemId}`}
          className="text-sm rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700"
        >
          View all
        </Link>
      </header>
      <Tabs defaultValue={appwriteItemId} className="w-full">
        <TabsList className="custom-scrollbar mb-8 flex w-full flex-nowrap">
          {accounts.map((account) => (
            <TabsTrigger
              key={account.id}
              value={account.appwriteItemId}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 cursor-pointer"
            >
              <BankTabItem account={account} appwriteItemId={appwriteItemId} />
            </TabsTrigger>
          ))}
        </TabsList>
        {accounts.map((account) => (
          <TabsContent
            key={account.id}
            value={account.appwriteItemId}
            className="space-y-4"
          >
            <BankInfo
              account={account}
              type="full"
              appwriteItemId={appwriteItemId}
            />
            <TransactionsTable transactions={currentTransactions} />
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination page={page} totalPages={totalPages} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
