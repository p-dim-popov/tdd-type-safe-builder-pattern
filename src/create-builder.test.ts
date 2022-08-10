import { createBuilder } from "/src/create-builder.ts";

interface PersonBuilder {
  name: [name: string];
  age?: [age: number];
  insurance?: [];
}

interface Person {
  asString: string;
}

const personBuilder = createBuilder<Person, PersonBuilder>(
  {
    withName: (options) => (name) => ({
      ...options,
      withName: [name.toLocaleUpperCase()],
    }),
    withAge: (options) => (age) => ({ ...options, withAge: [age] }),
    withInsurance: (options) => () => ({ ...options, withInsurance: [] }),
  },
  ({ withName, withAge }) => ({
    asString: `name: ${withName}, age: ${withAge}`,
  }),
);

personBuilder.build({
  withName: [""],
  withAge: [2],
});
