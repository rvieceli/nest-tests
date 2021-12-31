import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as session from 'express-session';
import { AppModule, EnvironmentVariables } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);

  app.use(cookieParser());
  app.use(compression());
  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.enableCors();

  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
