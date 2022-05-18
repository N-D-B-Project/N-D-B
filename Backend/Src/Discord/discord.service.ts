import 'dotenv/config';
import * as Discord from 'discord.js';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { IDiscordProvider } from 'Src/Utils/Providers';

@Injectable()
export class DiscordService implements IDiscordProvider {
  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

  fetchClient() {
    return this.httpService
      .get(`http://discord.com/api/v9/users/@me`, {
        headers: {
          Authorization: `Bot ${process.env.ClientTOKEN}`,
        },
      })
      .pipe(map((response) => response.data));
  }

  fetchGuilds(accessToken: string) {
    return this.httpService
      .get('http://discord.com/api/v9/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(map((response) => response.data));
  }
  fetchGuildRoles(guildId: string) {
    throw new Error('Method not implemented.');
  }
  fetchGuildEmojis(guildId: string) {
    throw new Error('Method not implemented.');
  }
  fetchGuildStickers(guildId: string) {
    throw new Error('Method not implemented.');
  }

  fetchClientGuilds() {
    return this.httpService
      .get('http://discord.com/api/v9/users/@me/guilds', {
        headers: {
          Authorization: `Bot ${process.env.ClientTOKEN}`,
        },
      })
      .pipe(map((response) => response.data));
  }

  fetchMutualGuilds(clientGuilds, userGuilds: Discord.Guild) {
    throw new Error('Method not implemented.');
  }
}
