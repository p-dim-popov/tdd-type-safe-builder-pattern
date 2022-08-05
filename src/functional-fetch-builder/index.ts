import { Fetch } from "/src/interfaces.ts";

type Dependencies = {
    fetch: Fetch;
}

type Options = {
    withPath: string;
}

export const createFetchBuilder = ({ fetch }: Dependencies, { withPath }: Options) => {
    return {
        path: withPath,
        build: () => () => fetch("")
    }
}