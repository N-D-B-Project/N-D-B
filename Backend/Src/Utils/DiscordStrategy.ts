/* eslint-disable prettier/prettier */

import { Profile, Strategy } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { IAuthProvider } from './Providers';

@Injectable()
export default class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH_SERVICE') private readonly AuthService: IAuthProvider) {
    super({
      clientID: process.env.ClientID,
      clientSecret: process.env.ClientSecret,
      callbackURL: process.env.CallbackURL,
      scope: ['identify', 'guilds']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    const { username, discriminator, id: userID, avatar } = profile;
    const details = { username, discriminator, userID, avatar, accessToken, refreshToken};
    return await this.AuthService.validateUser(details);
  }
}
