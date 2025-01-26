export type MaybePromise<T> = Promise<T> | T;

export type ArrayOneOrMore<T> = [T, ...Array<T>];
