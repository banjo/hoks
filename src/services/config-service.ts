import JSON5 from "json5";
import fs from "node:fs/promises";
import type { Args } from "../cli";
import { EXAMPLE_CONFIG } from "../constants";
import { configTypeToConfigFile } from "../maps";
import { isDevelopment } from "../runtime";
import { type Config, type ConfigType } from "../types/types";
import { LogService } from "./log-service";
import { type FoundConfigFile } from "./path-service";

export type ConfigFileInfo = FoundConfigFile & { type: ConfigType };

const getConfigType = (args: Args = {} as Args): ConfigType => {
    const flags = args?.flags;

    if (flags?.javascript || flags?.js) {
        return "js";
    } else if (flags?.package) {
        return "package.json";
    } else if (flags?.json) {
        return "json";
    }

    return "ts";
};

const configCreator = async (
    configType: ConfigType,
    handler: (config: Config) => string
): Promise<ConfigType> => {
    LogService.debug(`Creating hoks config file for ${configType}`);
    const content = handler(EXAMPLE_CONFIG);
    const file = configTypeToConfigFile[configType];
    await fs.writeFile(file, content);
    return configType;
};

const createConfig = async (args: Args): Promise<ConfigType> => {
    const configType = getConfigType(args);

    switch (configType) {
        case "js": {
            return configCreator(
                configType,
                (config: Config) => `module.exports = ${JSON5.stringify(config, null, 4)}`
            );
        }
        case "json": {
            return configCreator(configType, (config: Config) => JSON.stringify(config, null, 4));
        }
        case "package.json": {
            LogService.debug("Creating hoks config in package.json");
            const pkg = await fs.readFile("package.json", "utf8");

            const pkgJson = JSON.parse(pkg);

            pkgJson.hoks = EXAMPLE_CONFIG;

            await fs.writeFile("package.json", JSON.stringify(pkgJson, null, 4));
            LogService.debug(`Successfully created hoks config in package.json`);
            return configType;
        }

        default: {
            return configCreator(
                configType,
                (config: Config) =>
                    `import { defineConfig } from "${isDevelopment() ? "./src" : "hoks"}";
\nexport default defineConfig(${JSON5.stringify(config, null, 4)})`
            );
        }
    }
};

export const ConfigService = {
    createConfig,
};
