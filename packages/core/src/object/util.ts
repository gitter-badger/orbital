import { CastingContextExtension } from './casting-context-extension';
import { StringCastable } from './string-castable';
import { CastingContext } from './casting-context';
import { Printable } from './printable';
import { Context } from './context';

export function isPrintable(object: any): object is Printable {
  return !!object && typeof object.print === 'function';
}

export function isStringCastable<T>(object: object): object is StringCastable<T> {
  return !!object && !!(object as any).cast && typeof (object as any).cast === 'function';
}

export function buildCastingContext<T>(context: Context, extension: CastingContextExtension<T>): CastingContext<T> {
  return Object.assign(Object.create(context), extension);
}
