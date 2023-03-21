#!/usr/bin/env node
import { camelCase } from "change-case";
import * as dotenv from "dotenv";
import { Args, argv } from "./cli";
import { loadConfig } from "./config";
import "./features";
import { setDebug } from "./runtime";
import { CallService } from "./services/CallService";
import { CustomService } from "./services/CustomService";
import { GitService } from "./services/GitService";
import { LogService } from "./services/LogService";
import { standout } from "./utils";

dotenv.config();

const main = async (args: Args) => {
    const shouldInit = args.flags.init;
    const config = await loadConfig();

    if (!config && !shouldInit) {
        LogService.warning("No config found");
        return;
    }

    LogService.debug("Config found");

    if (config?.debug || args.flags.debug) setDebug();

    if (args.flags.init) {
        await GitService.init(config);
        return;
    }

    const hook = args.flags.type;
    if (!CallService.isValidHook(hook)) {
        LogService.debug("Invalid hook, exiting...");
        return;
    }

    LogService.info(`hoks > ${hook}`);

    LogService.debug(`Hook type found: ${standout(hook)}`);

    const camelCaseHook = camelCase(hook);
    const hasCustomHook = CallService.hasCustomHook(camelCaseHook, config);
    const features = CallService.getActiveFeatures(hook, config);

    if (!features && !hasCustomHook) {
        LogService.debug("No features or custom hook found, exiting...");
        return;
    }

    if (features) {
        LogService.debug("Running features...");
        await CallService.runFeatures(features, args._, config);
    }

    if (hasCustomHook) {
        LogService.debug("Running custom hook...");
        await CustomService.runHook(camelCaseHook, args._, config);
    }
};

main(argv);
