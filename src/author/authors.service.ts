import { Injectable } from '@nestjs/common';
import { Author } from './models/author.model';

@Injectable()
export class AuthorsService {
  findOne(id: number): Author | undefined {
    return {
      id,
      firstName: 'Author',
      lastName: `#${id}`,
    };
  }
}
