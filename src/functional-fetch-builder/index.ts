import { Fetch } from "/src/interfaces.ts";

type Dependencies = {
  fetch: Fetch;
};

type Options = {
  withPath: string;
  withQuery?: ConstructorParameters<typeof URLSearchParams>;
};

export const createFetchBuilder = (
  { fetch }: Dependencies,
  { withPath, withQuery }: Options,
) => {
  return {
    build: () => () =>
      fetch(`${withPath}${withQuery ? `?${new URLSearchParams(...withQuery)}` : ""}`),
  };
};
