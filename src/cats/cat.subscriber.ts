import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';

@EventSubscriber()
class CatSubscriber implements EntitySubscriberInterface<Cat> {
  constructor(connection: Connection, private catsService: CatsService) {
    connection.subscribers.push(this);
  }

  listenTo(): string | Function {
    return Cat;
  }

  async afterInsert(event: InsertEvent<Cat>): Promise<void> {
    const { name, age, breed } = event.entity;

    await this.catsService.noSqlCreate({ name, age, breed });
  }
}

export { CatSubscriber };
