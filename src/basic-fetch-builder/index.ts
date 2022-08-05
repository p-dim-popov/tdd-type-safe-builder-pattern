import { HttpMethod } from "/src/common.ts";
import { Fetch } from "/src/interfaces.ts";

export class BasicFetchBuilder {
  private path: string | undefined;
  private method: HttpMethod | undefined;
  private queryParams: URLSearchParams | undefined;

  constructor(private fetch: Fetch) {}

  build() {
    const { path, method, queryParams } = this;
    if (!path) throw new Error("Path is not specified!");
    if (!method) throw new Error("Http method is not specified!")

    const destination = queryParams ? `${path}?${queryParams.toString()}` : path;

    return () => this.fetch(destination, { method });
  }

  withPath = makeMethod(this, (path: string) => {
    this.path = path;
  });

  withMethod = makeMethod(this, (method: HttpMethod) => {
    this.method = method;
  });

  withQueryParams = makeMethod(this, (...pairs: [string, string][]) => {
    const params = new URLSearchParams(pairs);
    this.queryParams = params;
  });
}

function makeMethod<
  TFetcher extends BasicFetchBuilder,
  TFunction extends (...args: any[]) => void,
>(instance: TFetcher, functionBody: TFunction): (...args: Parameters<TFunction>) => BasicFetchBuilder {
  return (...args) => {
    functionBody(...args);
    return instance;
  };
}
