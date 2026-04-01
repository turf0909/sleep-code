/**
 * Deep immutable utility type.
 * Recursively makes all properties readonly, including array elements.
 */
export type DeepImmutable<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepImmutable<R>>
  : T extends object
    ? { readonly [K in keyof T]: DeepImmutable<T[K]> }
    : T

/**
 * Permutation utility type for creating all possible orderings of a union.
 * Used to exhaustively validate that a Set or tuple covers every member of
 * a union (e.g. NON_EDITABLE_MODES in messageQueueManager.ts).
 */
export type Permutations<T extends string, U extends string = T> =
  [T] extends [never]
    ? []
    : T extends T
      ? [T, ...Permutations<Exclude<U, T>>]
      : never
