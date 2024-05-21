import { User } from '@/types/User';
import { Models } from 'node-appwrite';

export function userToDto(user: Models.User<Models.Preferences>): User {
  return JSON.parse(JSON.stringify(user));
}
