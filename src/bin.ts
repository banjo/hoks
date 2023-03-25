#!/usr/bin/env node

import { Maybe, sortBy } from "@banjoanton/utils";
import { camelCase } from "change-case";
import { Args, argv } from "./cli";
import { loadConfig } from "./config";
import "./features";
import { setDebug } from "./runtime";
import { CallService } from "./services/call-service";
import { CustomService } from "./services/custom-service";
import { GitService } from "./services/git-service";
import { LogService } from "./services/log-service";
import { standout } from "./utils";

import * as dotenv from "dotenv";
import { EXAMPLE_CONFIG } from "./constants";
import { FullConfig } from "./types/types";
dotenv.config();

const runApp = async (args: Args, config: Maybe<FullConfig>) => {
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

    LogService.info(`hoks > ${hook}`);

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

const init = async (args: Args, config: Maybe<FullConfig>) => {
    let updatedConfig = config;
    if (!config) {
        LogService.warning("No config found, creating a new one");
        const result = await GitService.createConfig(args);
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

    await GitService.init(updatedConfig);
};

const main = async (args: Args) => {
    const shouldInit = args.flags.init;
    const config = await loadConfig();

    if (!config && !shouldInit) {
        LogService.warning("No config found, add --init to create a new config");
        return;
    }

    if (config?.debug || args.flags.debug) setDebug();

    if (shouldInit) {
        await init(args, config);
        return;
    }

    await runApp(args, config);
};

main(argv);
