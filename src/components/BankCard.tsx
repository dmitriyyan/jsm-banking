import { Account } from '@/types/Account';
import Image from 'next/image';
import Link from 'next/link';
import { Copy } from './Copy';

type BankCardProps = {
  account: Account;
  userName: string;
  showBalance?: boolean;
};

export function BankCard({ account, userName, showBalance }: BankCardProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <div className="flex flex-col">
      <Link
        href={`/transactions/${account.appwriteItemId}`}
        className="relative flex h-[190px] w-full max-w-[320px] justify-between rounded-[20px] border border-white bg-bank-gradient shadow-creditCard backdrop-blur-[6px]"
      >
        <div className="relative z-10 flex size-full max-w-[228px] flex-col justify-between rounded-l-[20px] bg-gray-700 bg-bank-gradient px-5 pb-4 pt-5">
          <h2 className="text-base font-semibold text-white">
            {account.name ?? userName}
          </h2>
          <p className="font-ibm-plex-serif font-black text-white">
            {formatter.format(account.currentBalance)}
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h2 className="text-xs font-semibold text-white">{userName}</h2>
              <h2 className="text-xs font-semibold text-white">●● / ●●</h2>
            </div>
            <p className="text-xs font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● <span className="text-base">{account.mask}</span>
            </p>
          </div>
        </div>
        <div className="flex size-full flex-1 flex-col items-end justify-between rounded-r-[20px] bg-bank-gradient bg-cover bg-center bg-no-repeat py-5 pr-5">
          <Image src="/icons/paypass.svg" alt="pay" width={20} height={24} />
          <Image
            src="/icons/mastercard.svg"
            alt="pay"
            width={45}
            height={32}
            className="ml-5"
          />
        </div>
        <Image
          src="/icons/lines.svg"
          alt="lines"
          width={316}
          height={190}
          className="absolute top-0 left-0"
        />
      </Link>
      {showBalance && <Copy title={account.shareableId} />}
    </div>
  );
}
