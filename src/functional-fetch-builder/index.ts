type Options = {
    withPath: string;
}

export const createFetchBuilder = ({ withPath }: Options) => {
    return {
        path: withPath,
        build: () => {}
    }
}