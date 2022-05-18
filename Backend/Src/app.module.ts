import 'dotenv/config';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';

import { join } from 'path';

import { AuthModule } from './Auth/auth.module';
import { UserResolver } from './GraphQL/Resolvers/User.resolver';
import { DiscordModule } from './Discord/discord.module';

@Module({
  imports: [
    AuthModule,
    DiscordModule,
    HttpModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    PassportModule.register({ session: true }),
    MongooseModule.forRoot(process.env.MongoURI),
    GraphQLModule.forRoot({
      //autoSchemaFile: true,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'Src/GraphQL/GraphQL-index.ts'),
        outputAs: 'class',
      },
      useGlobalPrefix: true,
      playground: true,
      cors: {
        origin: 'https://localhost:3000',
      },
    }),
  ],
  controllers: [],
  providers: [UserResolver],
})
export class AppModule {}
