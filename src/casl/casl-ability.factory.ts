import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import { User } from 'src/users/users.service';
import { Action } from './action.enum';

type Subjects = InferSubjects<User> | 'all';
type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    const isAdmin = user.roles.includes(Role.Admin);

    if (isAdmin) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<Subjects>,
    });
  }
}

interface IPolicyHandler {
  handle(ability: Ability): boolean;
}

type PolicyHandlerCallback = (ability: Ability) => boolean;

type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export { CaslAbilityFactory, PolicyHandler, AppAbility };
