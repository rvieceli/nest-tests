import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from './casl-ability.factory';

const CHECK_POLICIES_KEY = 'check_policy';
const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

export { CHECK_POLICIES_KEY, CheckPolicies };
