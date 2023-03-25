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
    -   Will run on commit-msg if some commit modifying hook is set to run (enforceConventionalCommits, commitMessage, etc)
-   git-install-hook
    -   is used for install on lock change
-   custom hooks
    -   Can be added directly in the settings, runs in the end
-   commit message
    -   message can be a function that returns a string, it gets pc as parameter
    -   Runs on commit-msg.
    -   If this feature is active, `staged` will run on commit-msg as well, after this, so that the check can be done before the stage file actions.
-   sync before push
    -   Wont sync if force push
-   enforceConventionalCommits
    -   Runs on commit-msg
    -   If this feature is active, `staged` will run on commit-msg as well, after this, so that the check can be done before the stage file actions. Any action that runs on pre-commit should be run on commit-msg to make sure that the commit is valid before it is made. This is a problem with git unfortunately.
-   init
    -   Will create a config file if one does not exist. Will default to typescript if nothing else is specified.
    -   Need to run everytime config is changed

## TODO

-   updated styling for staged files in cli
-   Look for minimatch alternatives
-   enforce conventional commits ☑️
-   enforce custom commit messages ☑️
-   fetch pre-push ☑️
    -   Do not fetch if force push ☑️
-   add option to run tests before push
-   branch naming convention ☑️
-   forbidden tokens in files
-   prevent push on selected branches ☑️
-   on init, remove git core.hooksPath and set to .git/hooks path ☑️
-   tests (related tests)
-   setup config file with init-script ☑️
-   use --debug flag to debug, do not need the debug flag in the settings ☑️
-   add support for config file with typescript ☑️
-   change hooks to camelCase in config ☑️
-   show spinner instead of text when running hooks config
-   rebase with branch before push?
-   config file should support ts, js and json (.default in import if js) ☑️
-   Import ts config with defineConfig, should work when built ☑️
-   Move defineConfig to index file, move cli to bin file ☑️
-   Fix build problem with bare imports ☑️
-   replace exit with process.exit ☑️
-   should not print if custom hook has no content ☑️
-   docs for config file types
-   fix tool for rebase with one conflict?
-   config for no todo in code
-   do not create config if file (ts or js) already exists ☑️
