type Fetch = typeof fetch;

export enum Method {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export class Fetcher {
  private path: string | undefined;
  private method: Method = Method.GET;
  private queryParams: URLSearchParams | undefined;

  constructor(private fetch: Fetch) {}

  build() {
    const { path, method } = this;
    if (!path) throw new Error("Path is not specified!");

    return () => this.fetch(path, { method });
  }

  withPath = makeWithSomethingMethod(this, (path: string) => {
    this.path = path;
  });

  withMethod = makeWithSomethingMethod(this, (method: Method) => {
    this.method = method;
  });

  withQueryParams = makeWithSomethingMethod(this, (...pairs: [string, string][]) => {
    const params = new URLSearchParams(pairs);
    this.queryParams = params;
  });
}

function makeWithSomethingMethod<
  TFetcher extends Fetcher,
  TFunction extends (...args: any[]) => void,
>(instance: TFetcher, functionBody: TFunction): (...args: Parameters<TFunction>) => Fetcher {
  return (...args) => {
    functionBody(...args);
    return instance;
  };
}
