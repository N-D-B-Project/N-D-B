import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: process.env.MongoURI,
});

store.on('error', function (error) {
  console.log(`Store Session Error: ` + error);
});

store.on('connect', () => console.log('Store Session Connected'));

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['https://localhost:3000'],
  });
  app.use(
    session({
      cookie: {
        maxAge: 60000 * 60 * 24,
      },
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      store: store,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(PORT, () => Logger.log(`Running on Port ${PORT}`));
}
bootstrap();
