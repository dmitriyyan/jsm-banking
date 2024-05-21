import { getLoggedInUser } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();

  if (user) {
    redirect('/');
  }

  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="flex h-screen w-full sticky top-0 items-center justify-end bg-sky-1 max-lg:hidden">
        <div>
          <Image
            src="/icons/auth-image.svg"
            alt="auth"
            width={500}
            height={500}
          />
        </div>
      </div>
    </main>
  );
}
