type Fetch = typeof fetch;

export class Fetcher {
  private path: string | undefined;

  constructor(private fetch: Fetch) {}

  build() {
    const { path } = this;
    if (!path) throw new Error("Path is not specified!");

    return () => this.fetch(path);
  }

  withPath(path: string): Fetcher {
    this.path = path;
    return this;
  }
}
