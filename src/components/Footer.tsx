'use client';
import { User } from '@/types/User';
import Image from 'next/image';
import { Button } from './ui/button';
import { signOut } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';

type FooterProps = {
  user: User;
  type?: 'mobile' | 'desktop';
};

export function Footer({ user, type = 'desktop' }: FooterProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/sign-in');
  }

  return (
    <footer className="flex items-center justify-between gap-2 py-6">
      <div
        className={
          type === 'mobile'
            ? 'flex size-10 items-center justify-center rounded-full bg-gray-200'
            : 'flex size-10 items-center justify-center rounded-full bg-gray-200 max-xl:hidden'
        }
      >
        <p className="text-xl font-bold text-gray-700">{user.firstName[0]}</p>
      </div>
      <div
        className={
          type === 'mobile'
            ? 'flex flex-1 flex-col justify-center'
            : 'flex flex-1 flex-col justify-center max-xl:hidden'
        }
      >
        <h4 className="text-sm truncate text-gray-700 font-semibold">
          {user.firstName} {user.lastName}
        </h4>
        <p className="text-sm truncate font-normal text-gray-600">
          {user.email}
        </p>
      </div>
      <Button
        onClick={handleSignOut}
        className={
          type === 'mobile'
            ? 'relative size-5'
            : 'relative size-5 max-xl:w-full max-xl:flex max-xl:justify-center max-xl:items-center'
        }
      >
        <Image src="icons/logout.svg" fill alt="sign out" />
      </Button>
    </footer>
  );
}
