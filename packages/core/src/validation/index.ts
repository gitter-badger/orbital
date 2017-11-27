import { integer, range } from './number';
import { ip, ipv4, ipv6 } from './network';

import { ValidationContext } from './validation-context';
export { Validator } from './validator';
export { ValidationContext };

export const Validation = {
  range,
  integer,
  ip,
  ipv4,
  ipv6
}
