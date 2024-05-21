'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CustomInput } from './CustomInput';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SignUpParams, signIn, signUp } from '@/lib/actions/user.actions';
import { User } from '@/types/User';

type AuthType = 'sign-in' | 'sign-up';

const createAuthFormSchema = (type: AuthType) =>
  z.object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters long.',
    }),
    // Sign Up
    ...(type === 'sign-up'
      ? {
          firstName: z.string().min(2),
          lastName: z.string().min(2),
          address1: z.string().min(3).max(50),
          city: z.string().min(3).max(50),
          state: z.string().min(2).max(2),
          postalCode: z.string().min(3).max(6),
          dateOfBirth: z.string().min(3),
          ssn: z.string().min(3),
        }
      : {}),
  });

type AuthFormProps = {
  type: AuthType;
};

export function AuthForm({ type }: AuthFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const authFormSchema = useMemo(() => createAuthFormSchema(type), [type]);
  const router = useRouter();

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      dateOfBirth: '',
      ssn: '',
    },
  });

  const { isLoading } = form.formState;

  async function onSubmit(values: z.infer<typeof authFormSchema>) {
    try {
      // Sign up with appwrite & create token
      if (type === 'sign-up') {
        const data = values as SignUpParams;
        const newUser = await signUp(data);
        setUser(newUser);
      } else {
        const user = await signIn({
          email: values.email,
          password: values.password,
        });
        setUser(user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const pageTitle = type === 'sign-in' ? 'Sign In' : 'Sign Up';
  return (
    <section className="flex min-h-screen w-full max-w-[420px] flex-col justify-center gap-5 py-10 md:gap-8">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex cursor-pointer items-center gap-1 ">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="horizon logo"
          />
          <h1 className="text-2xl font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h2 className="text-2xl lg:text-4xl font-semibold text-gray-900">
            {user ? 'Link Account' : pageTitle}
            <p className="text-base font-normal text-gray-600">
              {user
                ? 'Link your account to get started'
                : 'Please enter your details'}
            </p>
          </h2>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4"></div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      type="text"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      type="text"
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="address1"
                    type="text"
                    label="Address"
                    placeholder="Enter your address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    type="text"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      type="text"
                      label="State"
                      placeholder="ex: NY"
                    />

                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      type="text"
                      label="Postal Code"
                      placeholder="ex: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      type="text"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      type="text"
                      label="SSN"
                      placeholder="ex: 1234"
                    />
                  </div>
                </>
              )}
              <CustomInput
                control={form.control}
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
              />
              <CustomInput
                control={form.control}
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col gap-4">
                <Button
                  className="text-base rounded-lg border border-bankGradient bg-bank-gradient font-semibold text-white shadow-form"
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : (
                    pageTitle
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-sm font-normal text-gray-600">
              {type === 'sign-in'
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <Link
              className="text-sm cursor-pointer font-medium text-bankGradient"
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
            >
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
}
