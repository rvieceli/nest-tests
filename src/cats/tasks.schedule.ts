import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'cron name',
  })
  handleCron() {
    this.logger.debug('Called every 30 seconds');
  }
}

export { TasksService };
