import { Inject, Injectable } from "@nestjs/common";
import { userInfo } from "src/@Types";
import { Services } from "src/@Types/Constants";
import { IAuth, IUser } from "src/@Types/IServices";

@Injectable()
export class AuthService implements IAuth {
  constructor(@Inject(Services.USER) private readonly userService: IUser) {}

  public async validateUser(details: userInfo) {
    const user = await this.userService.getUser(details.userId);
    return user
      ? this.userService.updateUser(details)
      : this.userService.createUser(details);
  }
}
