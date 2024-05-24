'use client';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import Link from 'next/link';
import { SheetClose } from './ui/sheet';
import { usePathname } from 'next/navigation';

type SidebarLinksProps = {
  isMobile?: boolean;
};

const sidebarLinks = [
  {
    imgURL: '/icons/home.svg',
    route: '/',
    label: 'Home',
  },
  {
    imgURL: '/icons/dollar-circle.svg',
    route: '/my-banks',
    label: 'My Banks',
  },
  {
    imgURL: '/icons/transaction.svg',
    route: '/transactions',
    label: 'Transactions',
  },
  {
    imgURL: '/icons/money-send.svg',
    route: '/transfer-funds',
    label: 'Transfer Funds',
  },
];

export function SidebarLinks({ isMobile = false }: SidebarLinksProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col gap-6 max-md:pt-16 text-white">
      {sidebarLinks.map((link) => {
        const isActive =
          pathname === link.route || pathname.startsWith(`${link.route}/`);

        const linkContent = (
          <Link
            href={link.route}
            className={cn({
              'flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start':
                !isMobile,
              'flex gap-3 items-center p-4 rounded-lg w-full max-w-60':
                isMobile,
              'bg-bank-gradient': isActive,
              'hover:opacity-80': !isActive,
            })}
            key={link.label}
          >
            <div className="relative size-6">
              <Image
                src={link.imgURL}
                alt={link.label}
                width={isMobile ? 20 : undefined}
                height={isMobile ? 20 : undefined}
                fill={!isMobile}
                className={cn({ 'brightness-[3] invert-0': isActive })}
              />
            </div>
            <p
              className={cn(
                'text-base font-semibold text-black-2 max-xl:hidden max-md:block',
                {
                  'text-white': isActive,
                },
              )}
            >
              {link.label}
            </p>
          </Link>
        );

        if (isMobile) {
          return (
            <SheetClose asChild key={link.label}>
              {linkContent}
            </SheetClose>
          );
        }

        return linkContent;
      })}
      {isMobile && 'USER'}
    </div>
  );

  if (isMobile) {
    return <SheetClose asChild>{sidebarContent}</SheetClose>;
  }

  return sidebarContent;
}
