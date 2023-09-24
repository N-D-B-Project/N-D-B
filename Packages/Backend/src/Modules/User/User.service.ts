import { Inject, Injectable } from "@nestjs/common";
import { userInfo } from "src/@Types";
import { Repositories } from "src/@Types/Constants";
import { IUser } from "src/@Types/IServices";
import { UserRepository } from "./User.repository";

@Injectable()
export class USerService implements IUser {
  constructor(
    @Inject(Repositories.USER) private readonly userRepo: UserRepository
  ) {}

  public async createUser(details: userInfo) {
    return await this.userRepo.create(details);
  }

  public async getUser(userId: string) {
    return await this.userRepo.get(userId);
  }

  public async updateUser(details: userInfo) {
    return await this.userRepo.update(details);
  }
}
