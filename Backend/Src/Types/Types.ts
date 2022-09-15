/* eslint-disable prettier/prettier */
import { User } from '../Schemas/User.schema';

export type UserDetails = {
  username: string;
  discriminator: string;
  userID: string;
  avatar: string;
};

export type Done = (err: Error, user: User) => void;
