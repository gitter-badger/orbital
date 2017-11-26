
export interface StringCastable<T> {
  cast(source: string, context: CastingContext<T>): Resolvable<T>;
}
