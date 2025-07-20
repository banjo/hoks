import { includes, isNil, type Maybe } from "@banjoanton/utils";
import { cosmiconfig } from "cosmiconfig";
import { APP_NAME, DEFAULT_CONFIG, GIT_HOOKS_CAMEL_CASE } from "./constants";
import { LogService } from "./services/log-service";
import { PathService } from "./services/path-service";
import type { FullConfig } from "./types/types";

const searchPlaces = ["hoks.config.ts", "hoks.config.js", "hoks.config.json", "package.json"];

const readConfigFile = async (): Promise<FullConfig | null> => {
    let config: Maybe<FullConfig>;

    const root = await PathService.getRootDirectory([".git"]);

    const explorer = cosmiconfig(APP_NAME, { stopDir: root ?? undefined, searchPlaces });
    const result = await explorer.search();

    const content = result?.config;

    if (content?.default) {
        config = content.default;
    } else {
        config = content;
    }

    if (isNil(config)) {
        return null;
    }

    return config;
};

const isValidConfig = (config: unknown): boolean => {
    const isObject = typeof config === "object" && config !== null;

    if (!isObject) {
        return false;
    }

    const expectedKeys = Object.keys(DEFAULT_CONFIG);
    expectedKeys.push("debug"); // debug is not part of the default config
    const allHooks = GIT_HOOKS_CAMEL_CASE;
    const actualKeys = Object.keys(config);

    return actualKeys.every(key => expectedKeys.includes(key) || includes(allHooks, key));
};

export const loadConfig = async (): Promise<Maybe<FullConfig>> => {
    // Im lazy, use cosmiconfig to read other config files
    const config = await readConfigFile();

    if (isNil(config)) {
        LogService.debug("No config found");
        return undefined;
    }

    if (!isValidConfig(config)) {
        LogService.error("Invalid config file");
        process.exit(1);
    }

    return { ...DEFAULT_CONFIG, ...config };
};
