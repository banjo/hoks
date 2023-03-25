import JSON5 from "json5";
import fs from "node:fs/promises";
import { Args } from "../cli";
import { EXAMPLE_CONFIG } from "../constants";
import { configTypeToConfigFile } from "../maps";
import { isDevelopment } from "../runtime";
import { Config, ConfigType } from "../types/types";
import { FileUtil } from "../utils/file-util";
import { LogService } from "./log-service";

const configFileExists = async (): Promise<ConfigType | null> => {
    if (await FileUtil.fileExists("hoks.config.js")) {
        return "js";
    }

    if (await FileUtil.fileExists("hoks.config.ts")) {
        return "ts";
    }

    if (await FileUtil.fileExists("hoks.config.json")) {
        return "json";
    }

    if (await FileUtil.fileExists("package.json")) {
        const pkg = await fs.readFile("package.json", "utf8");
        const pkgJson = JSON.parse(pkg);

        if (pkgJson.hoks) {
            return "package.json";
        }
    }

    return null;
};

const getConfigType = (args: Args): ConfigType => {
    const flags = args.flags;

    if (flags.javascript) {
        return "js";
    } else if (flags.package) {
        return "package.json";
    } else if (flags.json) {
        return "json";
    }

    return "ts";
};

const configExists = async (): Promise<ConfigType | null> => {
    const configFileType = await configFileExists();

    if (configFileType) {
        if (configFileType === "package.json") {
            LogService.debug("Config file already exists, type: package.json");
            return null;
        }
        LogService.debug(`Config file already exists, name: hoks.config.${configFileType}`);
        return null;
    }

    return configFileType;
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
                (config: Config) => `export default ${JSON5.stringify(config, null, 4)}`
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
    configFileExists,
    getConfigType,
    configExists,
    createConfig,
};
