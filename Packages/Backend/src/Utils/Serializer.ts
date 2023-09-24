import { Inject } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { Done } from "src/@Types";
import { Services } from "src/@Types/Constants";
import { IUser } from "src/@Types/IServices";
import { UserEntity } from "src/Modules/Database/Entities";

export class Serializer extends PassportSerializer {
  constructor(@Inject(Services.USER) private readonly userService: IUser) {
    super();
  }
  serializeUser(user: UserEntity, done: Done) {
    done(null, user);
  }

  async deserializeUser(user: UserEntity, done: Done) {
    try {
      const User = await this.userService.getUser(user.userId);
      return User ? done(null, User) : done(null, null);
    } catch (err) {
      done(err, null);
    }
  }
}
