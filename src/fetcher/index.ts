type Fetch = typeof fetch;

export class Fetcher {
  constructor(private fetch: Fetch, private path: string) {}

  build() {
    return () => this.fetch(this.path);
  }

  withPath(path: string): Fetcher {
    this.path = path;
    return this;
  }
}
