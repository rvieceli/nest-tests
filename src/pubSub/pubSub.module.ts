import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/app.module';

import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from './constants';
import * as Redis from 'ioredis';

//https://wanago.io/2021/02/15/api-nestjs-real-time-graphql-subscriptions/

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const options: Redis.RedisOptions = {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          keyPrefix: 'GraphQLPubSub:',
        };
        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      },
    },
  ],
  exports: [PUB_SUB],
})
class PubSubModule {}

export { PubSubModule };
