import { cli } from "cleye";
import { version } from "../package.json";

export const argv = cli({
    name: "hoks",
    version,
    help: {
        description: "CLI for hoks",
    },
    flags: {
        type: {
            type: String,
            alias: "t",
            description: "Type of Git hook",
            required: true,
        },
        init: {
            type: Boolean,
            default: false,
            description: "Initialize (or update) the Git Hooks",
            alias: "i",
        },
        clean: {
            type: Boolean,
            default: false,
            description: "Clean the Git Hooks",
            alias: "c",
        },
        debug: {
            type: Boolean,
            default: false,
            description: "Enable debug mode",
            alias: "d",
        },
        typescript: {
            type: Boolean,
            default: true,
            description: "Create a TypeScript config file",
        },
        ts: {
            type: Boolean,
            default: true,
            description: "Create a TypeScript config file",
        },
        javascript: {
            type: Boolean,
            default: false,
            description: "Create a JavaScript config file",
        },
        js: {
            type: Boolean,
            default: false,
            description: "Create a JavaScript config file",
        },
        json: {
            type: Boolean,
            default: false,
            description: "Create a JSON config file",
        },
        package: {
            type: Boolean,
            default: false,
            description: "Create a package.json config",
        },
    },
});

export type Args = typeof argv;
