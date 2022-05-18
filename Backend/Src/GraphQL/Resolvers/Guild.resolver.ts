/* eslint-disable prettier/prettier */
import { Inject, UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, ResolveProperty, Resolver } from '@nestjs/graphql';
import { User } from 'Src/Schemas/User.schema';
import { GraphQLGuard } from '../../Utils/Guards';
import { IAuthProvider, IDiscordProvider } from '../../Utils/Providers';
import { Guild } from '../GraphQL-index';
import { CurrentUser } from './User.resolver';

@Resolver('Guild')
@UseGuards(GraphQLGuard)
export class GuildResolver {
  constructor(
    @Inject('AUTH_SERVICE') private readonly AuthService: IAuthProvider,
    @Inject('DISCORD_SERVICE')
    private readonly DiscordService: IDiscordProvider,
  ) {}

  @Query('getGuilds')
  async getGuilds(@CurrentUser() user: User) {
    return user;
  }
  @ResolveField()
  async guilds(@Parent() user: User) {
    return this.DiscordService.fetchGuilds(user.accessToken)
  }
}
