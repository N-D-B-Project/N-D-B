import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-discord";
import { Services } from "src/@Types/Constants";
import { IAuth } from "src/@Types/IServices";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(Services.AUTH) private readonly authService: IAuth) {
    super({
      clientID: process.env.DClientID,
      clientSecret: process.env.DSecret,
      callbackURL: process.env.DCallbackURL,
      scope: ["identify", "guilds", "email"]
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { username, discriminator, id: userId, avatar, email } = profile;
    const details = {
      username,
      discriminator,
      userId,
      avatar,
      email,
      accessToken,
      refreshToken
    };
    return await this.authService.validateUser(details);
  }
}
