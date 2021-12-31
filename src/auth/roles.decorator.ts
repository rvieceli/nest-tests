import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

const ROLES_KEY = 'roles';
const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
const OnlyAdmin = () => SetMetadata(ROLES_KEY, [Role.Admin]);

export { ROLES_KEY, Roles, OnlyAdmin };
