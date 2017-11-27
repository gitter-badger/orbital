import { integer, range } from './number';
import { ip, ipv4, ipv6 } from './network';
import { ValidationContext } from './validation-context';

export { Validator } from './validator';
export { ValidationContext } from './validation-context';
export { GeneralValidator } from './general-validator';
export const Validation = {
  integer,
  ip,
  ipv4,
  ipv6,
  range,
};
