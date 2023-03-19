#!/usr/bin/env node

import { cli, command } from "cleye";
import { version } from "../package.json";

console.log(); // Add a newline

const name = "<name>";

const subCommand = command(
    {
        name: "subcommand",
        parameters: [name],
        help: {
            description: "Example subcommand",
            usage: "subcommand <name>",
        },
    },
    argv => {
        console.log(`Hello ${argv._.name}`);
    }
);

cli(
    {
        name: "hoks",
        version,
        commands: [subCommand],
        help: {
            description: "Example CLI",
        },
    },
    argv => argv.showHelp()
);
