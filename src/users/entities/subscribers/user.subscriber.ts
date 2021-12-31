import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from '../user.entity';

@EventSubscriber()
class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo(): string | Function {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): void | Promise<any> {
    console.log('BEFORE USER INSERTED ', event.entity);
  }
}

export { UserSubscriber };
