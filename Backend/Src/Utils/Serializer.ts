/* eslint-disable prettier/prettier */
import { IAuthProvider } from './Providers';
import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../Schemas/User.schema';
import { Done } from '../Types/Types';

@Injectable()
export class SessionSerializer extends PassportSerializer {

  constructor(@Inject('AUTH_SERVICE') private readonly AuthService: IAuthProvider) {
    super();
  }
  
  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: Done) {
    const UserDB = await this.AuthService.findUser(user.userID);
    return UserDB ? done(null, UserDB) : done(null, null);
  }
}
