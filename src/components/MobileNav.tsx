import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User } from '@/types/User';
import Image from 'next/image';
import { Nav } from './Nav';
import { Footer } from './Footer';

type MobileNavProps = {
  user: User;
};

export function MobileNav({ user }: MobileNavProps) {
  return (
    <div className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Nav />
          <Footer type="mobile" user={user} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
