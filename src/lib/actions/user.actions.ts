'use server';
import { ID, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../server/appwrite';
import { cookies } from 'next/headers';
import { User } from '@/types/User';
import {
  CountryCode,
  LinkTokenCreateRequest,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid';
import { plaidClient } from '../server/plaid';
import { revalidatePath } from 'next/cache';
import { addFundingSource, createDwollaCustomer } from './dwolla.actions';

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export async function getUserInfo({ userId }: { userId: string }) {
  try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', userId)],
    );
    return JSON.parse(JSON.stringify(user.documents[0]));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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
    const user = await getUserInfo({ userId: session.userId });
    return JSON.parse(JSON.stringify(user));
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

export async function signUp({ password, ...restData }: SignUpParams) {
  try {
    const { email, firstName, lastName } = restData;
    const name = `${firstName} ${lastName}`;
    const { account, database } = await createAdminClient();
    const userAccount = await account.create(
      ID.unique(),
      email,
      password,
      name,
    );
    if (!userAccount) {
      throw new Error('Failed to create user account');
    }
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...restData,
      type: 'personal',
    });
    if (!dwollaCustomerUrl) {
      throw new Error('Failed to create Dwolla customer');
    }

    // Split the URL string by '/'
    const parts = dwollaCustomerUrl.split('/');
    // Extract the last part, which represents the customer ID
    const dwollaCustomerId = parts[parts.length - 1];

    const user = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...restData,
        userId: userAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      },
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const acc = await account.get();
    const user = await getUserInfo({ userId: acc.$id });
    return JSON.parse(JSON.stringify(user)) as User;
  } catch (error) {
    throw error;
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

export async function createLinkToken(user: User) {
  try {
    const tokenParams: LinkTokenCreateRequest = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: [Products.Auth],
      language: 'en',
      country_codes: [CountryCode.Us],
    };

    const res = await plaidClient.linkTokenCreate(tokenParams);
    return res.data.link_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createBankAccount({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: {
  userId: string;
  bankId: string;
  accountId: string;
  accessToken: string;
  fundingSourceUrl: string;
  shareableId: string;
}) {
  try {
    const { database } = await createAdminClient();
    const bankAccount = database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      },
    );
    return bankAccount;
  } catch (error) {
    console.error('An error occurred while creating a bank account:', error);
    throw error;
  }
}

export async function exchangePublicToken({
  publicToken,
  user,
}: {
  publicToken: string;
  user: User;
}) {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: btoa(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath('/');

    // Return a success message
    return {
      publicTokenExchange: 'complete',
    };
  } catch (error) {
    // Log any errors that occur during the process
    console.error('An error occurred while creating exchanging token:', error);
    throw error;
  }
}

export async function getBanks({ userId }: { userId: string }) {
  try {
    const { database } = await createAdminClient();
    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', userId)],
    );
    return JSON.parse(JSON.stringify(banks.documents));
  } catch (error) {
    console.error('An error occurred while getting the banks:', error);
    throw error;
  }
}

export async function getBank({ documentId }: { documentId: string }) {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', documentId)],
    );
    return JSON.parse(JSON.stringify(bank.documents[0]));
  } catch (error) {
    console.error('An error occurred while getting the bank:', error);
    throw error;
  }
}
