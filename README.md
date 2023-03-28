# hoks

> Amazingly simple Git hooks library, packed with great defaults. 

Hoks is a simple hooks library with everything you need pre-configured. Get up an running with one command. Enable or disable features as you need them. Add custom hooks if you need them.

* Get up and running with one command (ts, js, json or package.json)
* Simple configuration
* Great pre-configured defaults (branch validation, commit validation, staged commands, etc)
* Support for custom hooks

## Install

```bash
npm install hoks
```

To initialize the config file, run one of the following commands:

```bash
hoks --init
```

This will create a config file in the root of your project and set up everything you need to get started. You can use `--json`, `--js` or `--package` to create a config file in the format you prefer. 

## Usage

Update the config file to your needs. You can add custom hooks, disable or enable features. Everything is pre-configured for you. 

On a change you need to run the init command again to update the hooks. 

```bash
hoks --init
```

## Example

TypeScript will be used by default. It has the best support for type checking and intellisense. 

```ts
import { defineConfig } from "./src";

export default defineConfig({
 installOnLockChange: true,
    branchName: {
        pattern: "^feature/.+",
        message: "Branch name must start with 'feature/'",
    },
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
    syncBeforePush: false,
    enforceConventionalCommits: false,
    noTodos: false,
    testChanged: false,
});
```

## API Reference

### Install on lock change

Install dependencies on lock file change. Uses `git-install-hook` under the hood. Installs automatically by default, but can be a prompt.

type: `boolean | object`
default: `false`

```json
{
    "installOnLockChange": {
        "prompt": true,         // prompt before installing
        "installation": "show", // show, hide or spinner
        "noText": false         // do not show CLI text
    }
}
```

### Branch name

Validate branch name.

type: `boolean | object`
default: `false`

```json
{
    "branchName": {
        "pattern": "^feature/.+",                           // regex pattern
        "message": "Branch name must start with 'feature/'" // error message
    }
}
```

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

type: `boolean | object`
default: `false`

```json
{
    "commitMessage": {
        "pattern": "^ID-[0-9]+: .+",                                    // regex pattern
        "message": "Branch must look like this ID-<number>: <message>"  // error message
    }
}
```

The error message can be a string or a function that returns a string. It gets the `pc` object as parameter. This is `piccocolors` and can be used to style the text. 

```ts
{
    "commitMessage": {
        "pattern": "^ID-[0-9]+: .+",                                                    // regex pattern
        "message": pc => pc.red("Branch must look like this ID-<number>: <message>")    // error message
    }
}
```

### Staged

Run commands on staged files. Defaults to run on `pre-commit`, but will run on `commit-msg` if any feature that checks the commit message is enabled (commitMessage or enforceConventionalCommits). This is because the validation needs to run before running the commands.

type: `false | object`
default: `false`

```json
{
    "staged": {
        "*": "npm run format",      // run on all files
        "*.{ts,js}": "npm run lint" // run on all ts and js files
    }
}
```

The key is a minimatch pattern. The value is a command to run. If no `/` is used in the name, it will match the file name even if it is in a subdirectory. If `/` is used, it will match the whole path.

### Prevent commit

Prevent commits on certain branches.

type: `false | string | string[]`
default: `false`

```json
{
    "preventCommit": ["main", "master", "develop"]
}
```

### Sync before push

Sync (pull) before push. Will not sync if force push.

type: `boolean`
default: `false`

```json
{
    "syncBeforePush": false
}
```

### Enforce conventional commits

Enforce conventional commits. If `staged` is enabled, it will run before the staged commands by moving the staged commands to the `commit-msg` hook.

type: `boolean`
default: `false`

```json
{
    "enforceConventionalCommits": true
}
```

### No todos

Prevent commits with TODOs in comments.

type: `boolean`
default: `false`

```json
{
    "noTodos": true
}
```

### Test changed

Run tests on changed files. Supports for `jest` and `vitest`.

type: `boolean`
default: `false`

```json
{
    "testChanged": true
}
```

### Custom hooks

Any custom hook can be added. For example, the pre-commit hook can be added using camelCase `preCommit` as key and commands as value. This works for any valid hook.

type: `false | string | string[]`
default: `false`

```json
{
    "preCommit": ["npm run test"]
}
```