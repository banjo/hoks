# hoks

[![NPM version](https://img.shields.io/npm/v/hoks?color=%23c53635&label=%20)](https://www.npmjs.com/package/hoks)

A simple CLI application template.

## Install

```bash
npm install hoks -g
```

## Usage

```bash
# run
hoks

# run subcommand
hoks subcommand <name>
```

## important to add to readme

-   staged
    -   filter: if "/" is included it matches the whole path, otherwise it matches the file name even though it is in a subdirectory
-   git-install-hook
    -   is used for install on lock change
-   custom hooks
    -   Can be added directly in the settings, runs in the end
-   commit message
    -   message can be a function that returns a string, it gets pc as parameter

## TODO

-   updated styling for staged files in cli
-   Look for minimatch alternatives
-   enforce conventional commits
-   enforce custom commit messages ☑️
-   fetch pre-push
-   add option to run tests before push
-   branch naming convention ☑️
-   forbidden tokens in files
-   prevent push on selected branches ☑️
-   on init, remove git core.hooksPath and set to .git/hooks path
-   tests
-   setup config file with init-script
-   use --debug flag to debug, do not need the debug flag in the settings ☑️
-   add support for config file with typescript
-   change hooks to camelCase in config ☑️
-   show spinner instead of text when running hooks config
