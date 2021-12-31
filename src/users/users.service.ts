import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import { Connection } from 'typeorm';

export type User = {
  userId: number;
  username: string;
  password: string;
  roles: Role[];
};

@Injectable()
export class UsersService {
  private readonly users = [
    { userId: 1, username: 'joao', password: 'changeme', roles: [Role.User] },
    { userId: 2, username: 'maria', password: 'guess', roles: [Role.Admin] },
  ];

  constructor(private connection: Connection) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
