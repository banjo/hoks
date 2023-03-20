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

## important to add

* staged
  * filter: if "/" is included it matches the whole path, otherwise it matches the file name even though it is in a subdirectory
* git-install-hook
  * is used for install on lock change
