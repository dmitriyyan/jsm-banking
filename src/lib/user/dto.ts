import { User } from '@/types/User';
import { Models } from 'node-appwrite';

export function userSignInToDto(user: Models.User<Models.Preferences>): User {
  return JSON.parse(JSON.stringify(user));
}

export function userSignUpToDto(user: Models.Document): User {
  return JSON.parse(JSON.stringify(user));
}