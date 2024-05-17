import { MobileNav } from '@/components/MobileNav';
import { Sidebar } from '@/components/Sidebar';
import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = {
    firstName: 'User',
    lastName: 'Jsm',
  };
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={user} />
      <div className="flex size-full flex-col">
        <div className="flex h-16 items-center justify-between p-5 shadow-creditCard sm:p-8 md:hidden">
          <Image src="/icons/logo.svg" width={30} height={30} alt="menu icon" />
          <div>
            <MobileNav user={user} />
          </div>
        </div> 
        {children}
      </div>
    </main>
  );
}
