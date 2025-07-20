import { sortBy } from "@banjoanton/utils";
import type { Maybe } from "@banjoanton/utils";
import { camelCase } from "change-case";
import type { Args } from "../cli";
import { EXAMPLE_CONFIG } from "../constants";
import type { FullConfig } from "../types/types";
import { standout } from "../utils";
import { CallService } from "./call-service";
import { ConfigService } from "./config-service";
import { CustomService } from "./custom-service";
import { GitService } from "./git-service";
import { LogService } from "./log-service";

const initConfig = async (args: Args, config: Maybe<FullConfig>) => {
    let updatedConfig = config;
    if (!config) {
        LogService.warning("No config found, creating a new one");
        const result = await ConfigService.createConfig(args);

        if (!result) {
            LogService.error("Failed to create config");
            process.exit(1);
        }

        updatedConfig = EXAMPLE_CONFIG;
    }

    if (!updatedConfig) {
        LogService.error("Failed to load config");
        process.exit(1);
    }

    await GitService.initializeHooks(updatedConfig);
};

const runHandler = async (args: Args, config: Maybe<FullConfig>) => {
    if (!config) {
        LogService.error("No config found");
        return;
    }

    LogService.debug("Config found");

    const hook = args.flags.type;
    if (!CallService.isValidHook(hook)) {
        LogService.debug("Invalid hook, exiting...");
        return;
    }

    LogService.debug(`Hook type found: ${standout(hook)}`);

    const camelCaseHook = camelCase(hook);
    const hasCustomHook = CallService.hasCustomHook(camelCaseHook, config);
    const features = CallService.getActiveFeatures(hook, config);

    if (!features && !hasCustomHook) {
        LogService.debug("No features or custom hook found, exiting...");
        return;
    }

    LogService.log(`hoks > ${hook}`);

    if (features) {
        const sortedFeatures = sortBy(features, "priority", "desc");
        LogService.debug("Running features...");
        await CallService.runFeatures(sortedFeatures, args._, config);
    }

    if (hasCustomHook) {
        LogService.debug("Running custom hook...");
        await CustomService.runHook(camelCaseHook, args._, config);
    }
};

const clean = async () => {
    await GitService.cleanHooks();
    LogService.success("Git hooks cleaned");
};

export const RunService = {
    initConfig,
    runHandler,
    clean,
};
