# hoks

> Amazingly simple Git hooks library, packed with great defaults.

-   Get up and running with one command
-   Automatic setup of config file (TS, JS, JSON, package.json)
-   Simple configuration
-   Great pre-configured defaults (branch validation, commit validation, staged commands, etc)
-   Support for custom hooks

## Install

Install with the following commands. Run `hoks --init` on config updates to apply the changes.

```bash
# install
npm install hoks

# init typescript config file
hoks --init
```

Supported flags:

-   `--json` - use JSON config file
-   `--javascript` - use JS config file
-   `--package` - use package.json config file

## Uninstall

Either remove hooks in `.git/hooks/` manually or run the following command:

```bash
hoks --clean
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

## API Reference

### Install on lock change

Install dependencies on lock file change. Uses `git-install-hook` under the hood. Installs automatically by default, but can be a prompt.

-   type: `boolean | object`
-   default: `false`
-   command: `installOnLockChange`

```json
{
    "installOnLockChange": {
        "prompt": true,
        "installation": "show",
        "noText": false
    }
}
```

-   prompt: `boolean` - prompt before installing
-   installation: `show | hide | spinner` - show or hide the installation output
-   noText: `boolean` - hide the text

### Branch name

Validate branch name.

-   type: `boolean | object`
-   default: `false`
-   command: `branchName`

```json
{
    "branchName": {
        "pattern": "^feature/.+",
        "message": "Branch name must start with 'feature/'"
    }
}
```

-   pattern: `string` - regex pattern
-   message: `string | function` - error message

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

-   type: `boolean | object`
-   default: `false`
-   command: `commitMessage`

```json
{
    "commitMessage": {
        "pattern": "^ID-[0-9]+: .+",
        "message": "Branch must look like this ID-<number>: <message>"
    }
}
```

-   pattern: `string` - regex pattern
-   message: `string | function` - error message

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

-   type: `false | object`
-   default: `false`
-   command: `staged`

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

-   type: `false | string | string[]`
-   default: `false`
-   command: `preventCommit`

```json
{
    "preventCommit": ["main", "master", "develop"]
}
```

### Sync before push

Sync (pull) before push. Will not sync if force push.

-   type: `boolean`
-   default: `false`
-   command: `syncBeforePush`

```json
{
    "syncBeforePush": false
}
```

### Enforce conventional commits

Enforce conventional commits. If `staged` is enabled, it will run before the staged commands by moving the staged commands to the `commit-msg` hook.

-   type: `boolean`
-   default: `false`
-   command: `enforceConventionalCommits`

```json
{
    "enforceConventionalCommits": true
}
```

### No todos

Prevent commits with TODOs in comments.

-   type: `boolean`
-   default: `false`
-   command: `noTodos`

```json
{
    "noTodos": true
}
```

### Test changed

Run tests on changed files. Supports for `jest` and `vitest`.

-   type: `boolean`
-   default: `false`
-   command: `testChanged`

```json
{
    "testChanged": true
}
```

### Custom hooks

Any custom hook can be added. For example, the pre-commit hook can be added using camelCase `preCommit` as key and commands as value. This works for any valid hook.

-   type: `false | string | string[]`
-   default: `false`

```json
{
    "preCommit": ["npm run test"]
}
```
