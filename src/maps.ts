import { ConfigType } from "./types/types";

export const configTypeToConfigFile: Record<ConfigType, string> = {
    ts: "hoks.config.ts",
    js: "hoks.config.js",
    json: "hoks.config.json",
    "package.json": "package.json",
};
