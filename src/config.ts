import { includes, isDefined, Maybe } from "@banjoanton/utils";
import { cosmiconfig } from "cosmiconfig";
import jiti from "jiti";
import { APP_NAME, DEFAULT_CONFIG, GIT_HOOKS_CAMEL_CASE } from "./constants";
import { LogService } from "./services/log-service";
import { FullConfig } from "./types/types";

const cwd = process.cwd();
const jitiFile = jiti(cwd);

const explorer = cosmiconfig(APP_NAME);

const readTypescriptConfig = (): FullConfig | null => {
    try {
        const tsFile = jitiFile("./hoks.config.ts");

        return tsFile.default;
    } catch {
        return null;
    }
};

const readOtherConfigFile = async (): Promise<FullConfig | null> => {
    let config: Maybe<FullConfig>;
    const result = await explorer.search();
    const content = result?.config;

    if (content?.default) {
        config = content.default;
    } else {
        config = content;
    }

    if (!isDefined(config)) {
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
    const allHooks = GIT_HOOKS_CAMEL_CASE;
    const actualKeys = Object.keys(config);

    return actualKeys.every(key => expectedKeys.includes(key) || includes(allHooks, key));
};

export const loadConfig = async (): Promise<FullConfig> => {
    const tsConfig = readTypescriptConfig();

    if (isDefined(tsConfig) && isValidConfig(tsConfig)) {
        return { ...DEFAULT_CONFIG, ...tsConfig };
    }

    const config = await readOtherConfigFile();

    if (!isDefined(config)) {
        LogService.error("No config found");
        process.exit(1);
    }

    if (!isValidConfig(config)) {
        LogService.error("Invalid config file");
        process.exit(1);
    }

    return { ...DEFAULT_CONFIG, ...config };
};
