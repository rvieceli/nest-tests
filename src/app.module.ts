import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import * as redisStore from 'cache-manager-redis-store';
import * as Joi from 'joi';

import * as helmet from 'helmet';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnerModule } from './owner/owner.module';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CaslModule } from './casl/casl.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AuthorModule } from './author/author.module';
import { PubSubModule } from './pubSub/pubSub.module';
import { ComplexityPlugin } from './complexity.plugin';

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  SERVER_PORT: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  MONGODB_URI: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  SESSION_SECRET: string;
  JWT_SECRET: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object<EnvironmentVariables>({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        SERVER_PORT: Joi.number().integer().default(3000),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().integer().default(5432),
        DB_USERNAME: Joi.string().default('test'),
        DB_PASSWORD: Joi.string().default('test'),
        DB_DATABASE: Joi.string().default('test'),
        MONGODB_URI: Joi.string().default(
          'mongodb://test:test@localhost:27017',
        ),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().integer().default(6379),
        SESSION_SECRET: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
      // validationOptions: {
      //   allowUnknown: false,
      // },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
          synchronize: true,
        };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: 'test',
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        ttl: 120, //in seconds
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          keyPrefix: 'QUEUE',
        },
      }),
    }),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        ttl: 60,
        limit: 10,
        storage: new ThrottlerStorageRedisService({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          keyPrefix: 'THROTTLER:',
        }),
      }),
    }),
    PubSubModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        cors: true,
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src', 'schema.graphql'),
        installSubscriptionHandlers: true,
        debug: false,
        plugins: [
          configService.get('NODE_ENV') === 'development' &&
            ApolloServerPluginLandingPageLocalDefault(),
        ].filter(Boolean),
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
      }),
    }),
    CatsModule,
    UsersModule,
    AuthModule,
    OwnerModule,
    CaslModule,
    AuthorModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    AppService,
    ComplexityPlugin,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet(), LoggerMiddleware).forRoutes(CatsController);
  }
}
