type KeysOfType<T, SelectedType> = {
  [key in keyof T]: SelectedType extends T[key] ? key : never;
}[keyof T];

type Required<T> = Omit<T, KeysOfType<T, undefined>>;
type Optional<T> = Partial<Pick<T, KeysOfType<T, undefined>>>;

type OptionalUndefined<T> = Optional<T> & Required<T>;
type WithSomething<T = string> = T extends string ? `with${Capitalize<T>}`
  : never;

type UnwrapIfSingle<T extends readonly unknown[]> = T extends [] ? true
  : T extends [infer F] ? F
  : T;
type SkipArrayFirst<T extends readonly unknown[]> = T extends
  [infer F, ...infer R] ? R : T;

export const createBuilder = <
  TResult,
  TAlterersDefinitions,
  TOptions = OptionalUndefined<
    {
      [Key in keyof TAlterersDefinitions as WithSomething<Key>]:
        TAlterersDefinitions[Key];
    }
  >,
  TAlterers = NonNullable<
    {
      [Key in keyof TAlterersDefinitions as WithSomething<Key>]: (
        options: Omit<TOptions, WithSomething<Key>>,
      ) => (
        ...args: TAlterersDefinitions[Key] extends Array<infer P> | undefined
          ? NonNullable<TAlterersDefinitions[Key]>
          : never
      ) => TOptions;
    }
  >,
>(
  alterers: TAlterers,
  build: (options: TOptions) => TResult,
) => {
  return {
    ...alterers,
    build,
  };
};
