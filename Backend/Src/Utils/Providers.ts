/* eslint-disable prettier/prettier */
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Guild } from 'Src/GraphQL/GraphQL-index';
import { User } from '../Schemas/User.schema';
import { UserDetails } from '../Types/Types';

export interface IAuthProvider {
  validateUser(details: UserDetails);
  createUser(details: UserDetails);
  findUser(userID: string);/** : Promise<User | undefined> */
}

export interface IDiscordProvider {
  fetchClient(clientID: string)
  fetchGuilds(accessToken: string): Observable<AxiosResponse<Guild[]>>;
  fetchGuildRoles(guildId: string);
  fetchGuildEmojis(guildId: string);
  fetchGuildStickers(guildId: string);
  fetchClientGuilds(): Observable<AxiosResponse<Guild[]>>;
  fetchMutualGuilds(clientGuilds, userGuilds)//: Observable<AxiosResponse<Guild[]>>;
}