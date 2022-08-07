import { HttpMethod } from "../common.ts";
import { Fetch } from "/src/interfaces.ts";

type Dependencies = {
  fetch: Fetch;
};

type Options = {
  withPath: string;
  withHttpMethod: HttpMethod;
  withQuery?: NonNullable<ConstructorParameters<typeof URLSearchParams>[0]>;
};

const FAKE_PROTOCOL = "unknown:";
const FAKE_DOMAIN = "domain";

export const createFetchBuilder = (
  { fetch }: Dependencies,
  { withPath, withQuery, withHttpMethod }: Options,
) => {
    const url = (() => {
        try {
            return new URL(withPath)
        } catch {
            return new URL(`${FAKE_PROTOCOL}//${FAKE_DOMAIN}${withPath}`);
        }
    })();
    const protocol = url.protocol === FAKE_PROTOCOL ? null : url.protocol;    

    const params = combineSearchParams(url.searchParams, new URLSearchParams(withQuery))
    const query =  (() => {
      const strigified = params.toString();

      if (strigified) return `?${strigified}`

      return "";
    })();

  return {
    build: () => () =>
      fetch(`${protocol ? `${protocol}//${url.hostname}` : ""}${url.pathname}${query}`, { method: withHttpMethod }),
  };
};

const combineSearchParams = (...params: URLSearchParams[]) => params.reduce((acc, cur) => {
  const result = new URLSearchParams(acc);

  for (const [key, value] of cur.entries()) {
    result.append(key, value);
  }

  return result;
}, new URLSearchParams())