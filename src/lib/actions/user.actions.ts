'use server';

import { ID } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../server/appwrite';
import { cookies } from 'next/headers';
import { userToDto } from '../user/dto';
import { redirect } from 'next/navigation';

type SignInParams = {
  email: string;
  password: string;
};

export async function signIn(data: SignInParams) {
  try {
    const { email, password } = data;
    // Call the API to sign in
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    const user = await account.get();
    return userToDto(user);
  } catch (error) {
    throw error;
  }
}

export type SignUpParams = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  password: string;
};

export async function signUp(data: SignUpParams) {
  try {
    const { email, password, firstName, lastName } = data;
    const name = `${firstName} ${lastName}`;
    const { account } = await createAdminClient();
    const user = await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    return userToDto(user);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return userToDto(user);
  } catch (error) {
    redirect('/sign-in');
  }
}

export async function signOut() {
  try {
    const { account } = await createSessionClient();
    cookies().delete('appwrite-session');
    await account.deleteSession('current');
  } catch (error) {
    return null;
  }
}
