import { Role } from './role.enum';

interface JwtPayload {
  username: string;
  sub: number;
  roles: Role[];
}

export { JwtPayload };
