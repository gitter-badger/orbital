import { CastingContext } from './casting-context';
import { Resolvable } from 'villa';

export interface StringCastable<T> {
  cast(source: string, context: CastingContext<T>): Resolvable<T>;
}
