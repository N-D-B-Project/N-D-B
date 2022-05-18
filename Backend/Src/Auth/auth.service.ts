import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../Schemas/User.schema';
import { UserDetails } from '../Types/Types';
import { IAuthProvider } from '../Utils/Providers';

@Injectable()
export class AuthService implements IAuthProvider {
  constructor(@InjectModel(User.name) private userRepo: Model<UserDocument>) {}

  async validateUser(details: UserDetails) {
    const { userID } = details;
    const user = await this.userRepo.findOne({ userID }, details);
    if (user) {
      await this.userRepo.updateOne({ userID }, details);
      return user;
    }
    return this.createUser(details);
  }

  createUser(details: UserDetails): Promise<User | undefined> {
    const user = this.userRepo.create(details);
    const createdUser = new this.userRepo(user);
    return createdUser.save();
  }

  findUser(userID: string) /**: Promise<User | undefined> */ {
    return this.userRepo.findOne({ userID });
  }
}
