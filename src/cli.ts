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
        debug: {
            type: Boolean,
            default: false,
            description: "Enable debug mode",
            alias: "d",
        },
    },
});

export type Args = typeof argv;
