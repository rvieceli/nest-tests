import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Cat } from './entities/cat.entity';

interface SayHelloConsumerJobProps {
  cat: Cat;
}

@Processor('say-hello')
class SayHelloConsumer {
  private readonly logger = new Logger(SayHelloConsumer.name);

  @Process()
  async hello(job: Job<SayHelloConsumerJobProps>) {
    const { cat } = job.data;

    this.logger.debug(`Hello ${cat.name}`);

    return {};
  }
}

export { SayHelloConsumer };
