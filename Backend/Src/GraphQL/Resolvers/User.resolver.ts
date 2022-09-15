import {
  createParamDecorator,
  ExecutionContext,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  GqlExecutionContext,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../../Schemas/User.schema';
import { IAuthProvider, IDiscordProvider } from '../../Utils/Providers';
import { GraphQLGuard } from '../../Utils/Guards';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

@Resolver('User')
@UseGuards(GraphQLGuard)
export class UserResolver {
  constructor(
    @Inject('AUTH_SERVICE') private readonly AuthService: IAuthProvider,
    @Inject('DISCORD_SERVICE')
    private readonly DiscordService: IDiscordProvider,
  ) {}

  @Query('getUser')
  async getUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @ResolveField()
  async guilds(@Parent() user: User) {
    return this.DiscordService.fetchGuilds(user.accessToken);
  }
}
