# AGENTS.md

## Build, Lint, and Test Commands

- **Build:** `pnpm build` (uses tsup)
- **Lint:** `pnpm lint` (ESLint, config: @banjoanton/eslint-config)
- **Format:** `pnpm format` (Prettier, config: @banjoanton/prettier-config)
- **Typecheck:** `pnpm typecheck` (TypeScript strict mode)
- **Test (all):** `pnpm test` (vitest)
- **Test (watch):** `pnpm test:dev`
- **Test (single file):** `vitest path/to/file`
- **Test (single test):** `vitest -t "test name"`

## Code Style Guidelines

- **Imports:** Use ES module syntax. Prefer absolute imports from `src/`.
- **Formatting:** Follow Prettier rules. See `.prettierignore` for exclusions.
- **Types:** Use TypeScript strict mode. Always annotate function signatures and avoid `any`.
- **Naming:** Use `camelCase` for variables/functions, `PascalCase` for types/classes.
- **Error Handling:** Prefer explicit error handling. Use custom error classes if needed.
- **Linting:** Fix all ESLint errors and warnings before committing.
- **Pre-commit:** Code is auto-linted and formatted via lint-staged hooks.
- **File Structure:** Place features in `src/features/`, services in `src/services/`, and utilities in `src/utils/`.

_This file is for agentic coding agents. Follow these conventions for all contributions._

## Hoks as a library

- The CLI is in the bin.ts file, which is always called for all uses cases.
- If --init is passed, it will create a config if it not exists. If it exists, it will apply it and create all necessary git hooks.
- All git hooks are using the cli, they just pass the hook name as an argument.
- The user needs to run `hoks --init` once to create the correct git hooks.

## Guidelines

- ALWAYS prefer `undefined` over `null`
- Do not add comments to code UNLESS they are absolutely necessary to describe the logic in a way that is hard to read in the code
- Do not use `any`, use `undefined` or `unknown` if necessary
- Prefer e.g. `Maybe<string>` before `string | undefined`, imported from `@banjoanton/utils`
- Prefer early returns
- Use `const` functions over `function` syntax, unless you need hoisting
- Try to avoid nested ternaries, use it only for Typescript types. Normal ternaries are fine.
- Use a folder called `features` to divide the work into domains:
  - Example:
    - src/features/auth/{services,mappers,models}
    - src/features/dashboard/{services,utils}
- Use the following file types
  - services - main logic
  - utils - minor logic utils
  - mappers - mapping logic
  - models - model data
  - types - typescript types
  - react specific:
    - components - dumb react components, no logic
    - containers - smart react components, with hooks and logic
    - hooks - logic within hooks
- Method names should be camelCase. Eg.g. `getUser`.
- An example of a service file:
  - filename: user-service.ts
  - location: \*\*/services/user-service.ts
  - methods should be defined at the top
  - the initialization and export should be at the bottom
  - exported service should be capital case: export const UserService = { getUser }

Example:

```ts
const getUser = (id: string) => {
    return DatabaseService.getUser(id);
};

export const UserService = { getUser };
```

- If more than one argument, create an object.

Example:

```ts
type CreateUserProps = {
    name: string;
    age: number;
};

const createUser = (props: CreateUserProps) => {
    // ...
};
```

- Prefer to desctruct directly, unless they are too big.
- Types for props should always be directly above the method they are used in.
- Models should be created in the following way:

```ts
export type User = {
    name: string;
    age: number;
};

const from = (user: UserV1): User => {
    return {
        age: user.age,
        name: user.name,
    };
};

export const User = { from };
```

- Avoid using typescript enums, instead use the const enum as types or string literals. Like below.

```ts
export const UserRole = {
    ADMIN: "ADMIN",
    USER: "USER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
```

- Prefer `type` over `interface` when creating types
- Use `isDefined` from `@banjoanton/utils` as much as possible when checking values.
- Use `.filter(isDefined)` to remove undefined values from an array.

## Utils

### try catch wrapper

All try catches should occur with either `attempt` or `to` functions. They handle async and sync.

#### to

Attempt to run an async function like in Go, returning a tuple with the error and the result.

```ts
import { to } from "@banjoanton/utils";

const [error, result] = await to(async () => 1); // [undefined, 1]
const [error, result] = await to(async () => {
    throw new Error("test");
}); // [Error("test"), undefined]
```

#### attempt

Try to run an async function, and return a fallback value if it throws an error. Defaults to undefined if nothing is provided.

```ts
import { attempt } from "@banjoanton/utils";

const result = await attempt(async () => 1); // 1
const result = await attempt(async () => {
    throw new Error("test");
}); // undefined
```

### invariant

A function that throws an error if the condition is not met. It is used to make sure that the code is correct and that the function is used correctly.

```ts
import { invariant } from "@banjoanton/utils";

const data: string | undefined = getData();

invariant(data, "Data is undefined");
// Data is now guaranteed to be a string
```

### raise

Whenever you want to raise an error inline, use the raise function. It is a shorthand for throwing an error.

```ts
import { raise } from "@banjoanton/utils";

const data: string | undefined = getData();
const something = data ?? raise("Data is undefined");
```

### produce

Produce is used to create a new object with the same properties as the old one, but with the new values. It is used to make sure that the object is immutable.

```ts
import { produce } from "@banjoanton/utils";

const data = { a: 1, b: 2 };
const newData = produce(data, draft => {
    draft.a = 2;
});
```

### Guidelines

- Always use `to` over try catch
- Prefer to use `produce` for immutable stuff
- ALWAYS prefer `Result` for returning data from services and methods
