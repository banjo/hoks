import { cli } from "cleye";
import { version } from "../package.json";

export const argv = cli({
    name: "hoks",
    version,
    help: {
        description: "Example CLI",
    },
    flags: {
        type: {
            type: String,
            alias: "t",
            description: "Type of Git hook",
            required: true,
        },
    },
});

export type Args = typeof argv;
