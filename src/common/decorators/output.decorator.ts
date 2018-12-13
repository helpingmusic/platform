import { ReflectMetadata } from '@nestjs/common';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { OutputData } from 'src/common/interceptors/output.interceptor';

/**
 * Add reflect metadata for output interceptor
 */

type ViewModel = new(...args: any[]) => any;

const defaultRole = UserRoles.GUEST;
export const Output = (od: OutputData | ViewModel) => {

  const isVm = typeof od === 'function';
  // grab vm for associated role, or give default
  const forRole = r => isVm ? od : (od[r] || od[defaultRole]);

  const out: OutputData = {
    [UserRoles.ADMIN]: forRole(UserRoles.ADMIN),
    [UserRoles.USER]: forRole(UserRoles.USER),
    [UserRoles.GUEST]: forRole(UserRoles.GUEST),
  };

  return ReflectMetadata('output', out);
};
