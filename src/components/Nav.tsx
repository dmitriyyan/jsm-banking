import { cn } from '@/lib/cn';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarLinks } from './SidebarLinks';

type NavProps = {
  isMobile?: boolean;
};

export function Nav({ isMobile = false }: NavProps) {
  return (
    <>
      <Link
        href="/"
        className="flex md:mb-12 cursor-pointer items-center md:gap-2 gap-1 max-md:px-4 justify-center"
      >
        <Image
          src="/icons/logo.svg"
          width={34}
          height={34}
          alt="horizon logo"
          className="md:size-6 max-xl:size-14"
        />
        <h1 className="2xl:text-2xl font-ibm-plex-serif text-2xl font-bold text-black-1 max-xl:hidden max-md:block">
          Horizon
        </h1>
      </Link>
      <div
        className={cn({
          'flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto':
            isMobile,
        })}
      >
        <SidebarLinks isMobile={isMobile} />
        {isMobile && 'FOOTER'}
      </div>
    </>
  );
}
