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
  private method: Method | undefined;
  private queryParams: URLSearchParams | undefined;

  constructor(private fetch: Fetch) {}

  build() {
    const { path, method, queryParams } = this;
    if (!path) throw new Error("Path is not specified!");
    if (!method) throw new Error("Http method is not specified!")

    const destination = queryParams ? `${path}?${queryParams.toString()}` : path;

    return () => this.fetch(destination, { method });
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
