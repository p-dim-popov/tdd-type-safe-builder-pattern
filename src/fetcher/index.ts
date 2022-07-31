type Fetch = typeof fetch;

export class Fetcher {
    constructor(private fetch: Fetch, private path: string) {}

    build() {
        return () => this.fetch(this.path);
    }
}
