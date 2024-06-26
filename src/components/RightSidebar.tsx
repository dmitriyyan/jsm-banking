import { Account } from '@/types/Account';
import { Bank } from '@/types/Bank';
import { User } from '@/types/User';
import Image from 'next/image';
import Link from 'next/link';
import { BankCard } from './BankCard';
import { Transaction } from '@/types/Transaction';
import { CategoryCount } from '@/types/Category';
import { Category } from './Category';

type RightSidebarProps = {
  user: User;
  transactions: Transaction[];
  banks: Bank[] & Account[];
};

export function countTransactionCategories(
  transactions: Transaction[],
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    }),
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function RightSidebar({ user, transactions, banks }: RightSidebarProps) {
  const categories = countTransactionCategories(transactions);

  return (
    <aside className="no-scrollbar hidden h-screen max-h-screen flex-col border-l border-gray-200 xl:flex w-[355px] xl:overflow-y-scroll">
      <div className="flex flex-col pb-8">
        <div className="h-[120px] w-full bg-gradient-mesh bg-cover bg-no-repeat" />
        <div className="relative flex px-6 max-xl:justify-center">
          <div className="flex-center absolute -top-8 size-24 rounded-full bg-gray-100 border-8 border-white p-2 shadow-profile">
            <span className="text-5xl font-bold text-blu-500">
              {user.firstName[0]}
            </span>
          </div>
          <div className="flex flex-col pt-24">
            <h2 className="text-24 font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-base font-normal text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8 px-6 py-8">
        <div className="flex w-full justify-between">
          <h2 className="text-lg font-semibold text-gray-900">My banks</h2>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/plus.svg"
              alt="Add bank"
              width={20}
              height={20}
            />
            <h2 className="text-sm font-semibold text-gray-600">Add bank</h2>
          </Link>
        </div>
        {banks.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                />
              </div>
            )}
          </div>
        )}
        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="text-18 font-semibold text-gray-900">
            Top categories
          </h2>
          <div className="space-y-5">
            {categories.map((cat) => (
              <Category key={cat.name} category={cat} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
