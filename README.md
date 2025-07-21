# hoks

> Amazingly simple Git hooks library, packed with great defaults.

- Get up and running with one command
- Automatic setup of config file (TS, JS, JSON, package.json)
- Simple configuration
- Great pre-configured defaults (branch validation, commit validation, staged commands, etc)
- Support for custom hooks

## Install

Install with the following commands. Run `hoks --init` on config updates to apply the changes.

```bash
# install
npm install hoks

# init typescript config file
npx hoks --init
```

Supported flags:

- `--json` - use JSON config file
- `--javascript` - use JS config file
- `--package` - use package.json config file

## Uninstall

Either remove hooks in `.git/hooks/` manually or run the following command:

```bash
npx hoks --clean
```

## Example

```ts
import { defineConfig } from "hoks";

export default defineConfig({
    installOnLockChange: true,
    commitMessage: {
        pattern: "^ID-[0-9]+: .+",
        message: pc => pc.red("Branch must look like this ID-<number>: <message>"),
    },
    preCommit: ["npm run test"],
    staged: {
        "*": "npm run format",
        "*.{ts,js}": "npm run lint",
    },
    preventCommit: ["main", "master", "develop"],
});
```

## Conditional Hook Execution with `include`

You can control when hooks run by specifying an `include` field in your `hoks.config.ts` (or other config). This field takes an array of glob patterns (relative to the repo root). If set, hooks will only run if any staged file matches one of the globs. If not set, hooks always run (default behavior).

**Example:**

```ts
export default defineConfig({
    // ...other config options
    include: ["apps/web/*", "src/features/*"], // Only run hooks if staged files in these folders
});
```

- If any staged file matches a glob in `include`, the hook runs as normal.
- If no staged files match, the hook is skipped for that commit.
- If `include` is not set, hooks always run (legacy/default behavior).

**Use cases:**

- Speed up hooks in monorepos by only running checks for relevant folders.
- Prevent unnecessary hook runs for unrelated changes.

## API Reference

### Install on lock change

Install dependencies on lock file change. Uses `git-install-hook` under the hood. Installs automatically by default, but can be a prompt. Will run on branch change and after a merge.

- type: `boolean | object`
- default: `false`
- command: `installOnLockChange`
- hooks: `post-checkout`, `post-merge`

```json
{
    "installOnLockChange": {
        "prompt": true,
        "installation": "show",
        "noText": false
    }
}
```

- prompt: `boolean` - prompt before installing
- installation: `show | hide | spinner` - show or hide the installation output
- noText: `boolean` - hide the text

### Branch name

Validate branch name.

- type: `boolean | object`
- default: `false`
- command: `branchName`
- hooks: `pre-commit`

```json
{
    "branchName": {
        "pattern": "^feature/.+",
        "message": "Branch name must start with 'feature/'"
    }
}
```

- pattern: `string` - regex pattern
- message: `string | function` - error message

The error message can be a string or a function that returns a string. It gets the `pc` object as parameter. This is `piccocolors` and can be used to style the text.

```ts
{
    "branchName": {
        "pattern": "^feature/.+",
        "message": pc => pc.red("Branch name must start with 'feature/'")
    }
}
```

### Commit message

Validate commit message. Will run on `commit-msg` hook. If `staged` is enabled, it will run before the staged commands by moving the staged commands to the `commit-msg` hook.

- type: `boolean | object`
- default: `false`
- command: `commitMessage`
- hooks: `commit-msg`

```json
{
    "commitMessage": {
        "pattern": "^ID-[0-9]+: .+",
        "message": "Branch must look like this ID-<number>: <message>"
    }
}
```

- pattern: `string` - regex pattern
- message: `string | function` - error message

The error message can be a string or a function that returns a string. It gets the `pc` object as parameter. This is `piccocolors` and can be used to style the text.

```ts
{
    "commitMessage": {
        "pattern": "^ID-[0-9]+: .+",
        "message": pc => pc.red("Branch must look like this ID-<number>: <message>")
    }
}
```

### Staged

Run commands on staged files. Defaults to run on `pre-commit`, but will run on `commit-msg` if any feature that checks the commit message is enabled (commitMessage or enforceConventionalCommits). This is because the validation needs to run before running the commands.

- type: `false | object`
- default: `false`
- command: `staged`
- hooks: `pre-commit`, `commit-msg`

```json
{
    "staged": {
        "*": "npm run format",
        "*.{ts,js}": "npm run lint"
    }
}
```

The key is a minimatch pattern. The value is a command to run. If no `/` is used in the name, it will match the file name even if it is in a subdirectory. If `/` is used, it will match the whole path.

### Prevent commit

Prevent commits on certain branches.

- type: `false | string | string[]`
- default: `false`
- command: `preventCommit`
- hooks: `pre-commit`

```json
{
    "preventCommit": ["main", "master", "develop"]
}
```

### Sync before push

Sync (pull) before push. Will not sync if force push.

- type: `boolean`
- default: `false`
- command: `syncBeforePush`
- hooks: `pre-push`

```json
{
    "syncBeforePush": false
}
```

### Enforce conventional commits

Enforce conventional commits. If `staged` is enabled, it will run before the staged commands by moving the staged commands to the `commit-msg` hook.

- type: `boolean`
- default: `false`
- command: `enforceConventionalCommits`
- hooks: `commit-msg`

```json
{
    "enforceConventionalCommits": true
}
```

### No todos

Prevent commits with TODOs in comments.

- type: `boolean`
- default: `false`
- command: `noTodos`
- hooks: `pre-commit`

```json
{
    "noTodos": true
}
```

### Test changed

Run tests on changed files. Supports for `jest` and `vitest`.

- type: `boolean`
- default: `false`
- command: `testChanged`
- hooks: `pre-commit`

```json
{
    "testChanged": true
}
```

### Include

Control when hooks run by specifying an `include` field. This field takes an array of glob patterns (relative to the repo root). If set, hooks will only run if any staged file matches one of the globs. If not set, hooks always run (default behavior).

- type: `string[]`
- default: not set (hooks always run)
- command: `include`
- hooks: all

```ts
{
    "include": ["apps/web/**", "src/features/**"]
}
```

- If any staged file matches a glob in `include`, the hook runs as normal.
- If no staged files match, the hook is skipped for that commit.
- If `include` is not set, hooks always run (legacy/default behavior).

**Use cases:**

- Speed up hooks in monorepos by only running checks for relevant folders.
- Prevent unnecessary hook runs for unrelated changes.

### Custom hooks

Any custom hook can be added. For example, the pre-commit hook can be added using camelCase `preCommit` as key and commands as value. This works for any valid hook.

- type: `false | string | string[]`
- default: `false`

```json
{
    "preCommit": ["npm run test"]
}
```
