type ShapeConfig<T> = { [Key in keyof T]: ShapePropSetter<T, Key> | ShapePropAutoSetter }

type ShapePropSetter<T, Key extends keyof T> = ((...args: any[]) => (init: Partial<T>) => T[Key])

type ShapePropAutoSetter = 'auto'

type ShapeInit<T, Config extends ShapeConfig<T>> = { [Key in keyof T]: Config[Key] extends ShapePropSetter<T, Key> ? Parameters<Config[Key]> : [T[Key]] }

export const createBuilder = <T>() => <Config extends ShapeConfig<T>>(config: Config) => ({
        build: (opts: ShapeInit<T, Config>) => Object.entries(opts).reduce((acc, [key, value]) => {
            const shapeKey = key as keyof T
            const configSetter = config[shapeKey]
            const setter = configSetter === 'auto' ? autoSetter() : configSetter

            return {
                ...acc,
                [key]: (setter as ShapePropSetter<T, keyof T>)(...[value].flat())(acc)
            }
        }, {} as any)
    })

const autoSetter = <T, K extends keyof T, V extends T[K]>(): ShapePropSetter<T, K> => (value: V) => (): V => value

type Car = {
    model: string | null
    make: string
    year: number
}

const carBuilder = createBuilder<Car>()({
    make: (facturer: string, country: string) => init => `${facturer}_${init.year}`,
    year: 'auto',
    model: autoSetter(),
})

const car = carBuilder.build({
    make: ['123', 'BG'],
    year: [1234],
    model: ['123']
})