'use client';
import { useSearchParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/cn';
import { Account } from '@/types/Account';
import { formUrlQuery } from '@/lib/urlQuery';

type BankTabItemProps = {
  account: Account;
  appwriteItemId?: string;
};

export function BankTabItem({ account, appwriteItemId }: BankTabItemProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: account?.appwriteItemId,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div onClick={handleBankChange} role="button">
      <div
        className={cn(
          'gap-[18px] border-b-2 flex px-2 sm:px-4 py-2 transition-all',
          {
            ' border-blue-600': isActive,
          },
        )}
      >
        <p
          className={cn(
            `text-base line-clamp-1 flex-1 font-medium text-gray-500`,
            {
              ' text-blue-600': isActive,
            },
          )}
        >
          {account.name}
        </p>
      </div>
    </div>
  );
}
