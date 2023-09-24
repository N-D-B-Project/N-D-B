import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import * as session from "express-session";
import * as passport from "passport";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function bootstrap() {
  const PORT = process.env.PORT;
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const ONE_DAY_COOKIE_TIME = 60000 * 60 * 24;
  const ONE_MINUTE_CHECK = 60 * 1000;

  app.setGlobalPrefix("api");

  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: ONE_DAY_COOKIE_TIME
      },
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: ONE_MINUTE_CHECK,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined
      })
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: ["localhost:3000"],
    credentials: true
  });

  const SwaggerConfig = new DocumentBuilder()
    .setTitle("N-D-B Api /v1")
    .setDescription("N-D-B Api")
    .setVersion("1.0")
    .addTag("API")
    .build();

  const SwaggerDocument = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup("api", app, SwaggerDocument);

  try {
    await app.listen(PORT);
    logger.log(`Running on Port: ${PORT} in ${process.env.ENVIRONMENT} mode`);
  } catch (error) {
    logger.error("An error occurred when starting: ", error);
  }
}
bootstrap();
