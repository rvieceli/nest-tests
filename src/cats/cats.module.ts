import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import * as schema from './cat.schema';
import { CatSubscriber } from './cat.subscriber';
import { TasksService } from './tasks.schedule';
import { BullModule } from '@nestjs/bull';
import { SayHelloConsumer } from './say-hello.consumer';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cat]),
    MongooseModule.forFeature([
      { name: schema.Cat.name, schema: schema.CatSchema },
    ]),
    BullModule.registerQueue({
      name: 'say-hello',
    }),
    HttpModule,
  ],
  controllers: [CatsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    CatsService,
    CatSubscriber,
    TasksService,
    SayHelloConsumer,
  ],
  exports: [CatsService],
})
export class CatsModule {}
