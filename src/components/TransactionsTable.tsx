import { Transaction } from '@/types/Transaction';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { transactionCategoryStyles } from '@/constants';

type TransactionTableProps = {
  transactions: Transaction[];
};

const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? 'Processing' : 'Success';
};

const CategoryBadge = ({ category }: { category: string }) => {
  const { backgroundColor, borderColor, chipBackgroundColor, textColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] ?? transactionCategoryStyles.default;
  return (
    <div
      className={cn(
        borderColor,
        chipBackgroundColor,
        'flex items-center justify-center truncate w-fit gap-1 rounded-2xl border-[1.5px] py-[2px] pl-1.5 pr-2',
      )}
    >
      <div className={cn(backgroundColor, 'size-2 rounded-full')} />
      <p className={cn(textColor, 'text-[12px] font-medium')}>{category}</p>
    </div>
  );
};

export function TransactionsTable({ transactions }: TransactionTableProps) {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const status = getTransactionStatus(new Date(transaction.date));
          const amount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(transaction.amount);
          const isDebit = transaction.type === 'debit';
          const isCredit = transaction.type === 'credit';
          return (
            <TableRow
              key={transaction.$id}
              className={`${isCredit || amount[0] === '-' ? 'bg-[#fffbfa]' : 'bg-[#f6fef9]'} !over:bg-none !border-b-default`}
            >
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h4 className="text-sm truncate font-semibold text-[#344054]">
                    {transaction.name.replace(/[^\w\s]/gi, '')}
                  </h4>
                </div>
              </TableCell>
              <TableCell
                className={`pl-2 pr-10 font-semibold ${isCredit || amount[0] === '-' ? 'text-[#f04438]' : 'text-[#039855]'}`}
              >
                {isCredit ? '-' : ''}
                {amount}
              </TableCell>
              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} />
              </TableCell>
              <TableCell className="pl-2 pr-10 min-w-32">
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="pl-2 pr-10 max-md:hidden capitalize">
                {transaction.paymentChannel}
              </TableCell>
              <TableCell className="pl-2 pr-10 max-md:hidden">
                <CategoryBadge category={transaction.category} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
