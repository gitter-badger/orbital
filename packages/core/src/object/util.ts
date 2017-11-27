import { CastingContext } from './casting-context';
import { CastingContextExtension } from './casting-context-extension';
import { Context } from './context';
import { Printable } from './printable';
import { StringCastable } from './string-castable';

export function isPrintable(object: any): object is Printable {
  return !!object && typeof object.print === 'function';
}

export function isStringCastable<T>(object: object): object is StringCastable<T> {
  return !!object && !!(object as any).cast && typeof (object as any).cast === 'function';
}

export function buildCastingContext<T>(context: Context, extension: CastingContextExtension<T>): CastingContext<T> {
  return Object.assign(Object.create(context), extension);
}
