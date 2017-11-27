import { StringCastable } from './string-castable';

export type CastableType<T> = Orbital.Constructor<T> | StringCastable<T>;
