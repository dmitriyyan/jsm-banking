'use client';
import { Button } from './ui/button';
import { HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { useRouter } from 'next/navigation';
import {
  createLinkToken,
  exchangePublicToken,
} from '@/lib/actions/user.actions';
import { User } from '@/types/User';
import Image from 'next/image';

type PlaidLinkProps = {
  user: User;
  variant?: 'primary' | 'ghost';
  dwollaCustomerId?: string;
};

function getClassNames(variant?: 'primary' | 'ghost') {
  let className: HTMLAttributes<typeof Button>['className'] = '';
  if (variant === 'primary') {
    className =
      'text-base rounded-lg border border-bankGradient bg-bank-gradient font-semibold text-white shadow-form';
  } else if (variant === 'ghost') {
    className =
      'flex cursor-pointer items-center justify-center gap-3 rounded-lg px-3 py-7 hover:bg-white lg:justify-start';
  } else {
    className =
      'flex !justify-start cursor-pointer gap-3 rounded-lg !bg-transparent flex-row px-3 max-md:px-4 2xl:p-4';
  }
  return className;
}

export function PlaidLink({ user, variant, dwollaCustomerId }: PlaidLinkProps) {
  const [token, setToken] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function fetchToken() {
      try {
        const token = await createLinkToken(user);
        setToken(token);
      } catch (error) {
        console.error(error);
      }
    }

    fetchToken();
  }, [user]);

  const onSuccess = useCallback(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      });
      router.push('/');
    },
    [user, router],
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      <Button
        onClick={() => open()}
        disabled={!ready}
        className={getClassNames(variant)}
        variant={variant === 'ghost' ? 'ghost' : undefined}
      >
        {variant !== 'primary' ? (
          <>
            <Image
              src="icons/connect-bank.svg"
              alt="connect bank"
              width={24}
              height={24}
            />
            <p className="hidden text-base font-semibold text-black-2 xl:block">
              Connect Bank
            </p>
          </>
        ) : (
          'Connect Bank'
        )}
      </Button>
    </>
  );
}
