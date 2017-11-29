import { integer, range } from './number';
import { ip, ipv4, ipv6 } from './network';

import { ValidationContext } from './validation-context';

export { ValidatorFunction } from './validation-function';
export { GeneralValidator } from './general-validator';
export { Validator } from './validator';
export const Validation = {
  integer,
  ip,
  ipv4,
  ipv6,
  range,
};

export { ValidationContext };
