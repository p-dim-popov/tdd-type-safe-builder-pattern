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

  withPath(path: string): Fetcher {
    this.path = path;
    return this;
  }

  withMethod(method: Method): Fetcher {
    this.method = method;
    return this;
  }

  withQueryParams(...pairs: [string, string][]) {
    const params = new URLSearchParams(pairs);
    this.queryParams = params;
    return this;
  }
}
