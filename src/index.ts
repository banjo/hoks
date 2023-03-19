#!/usr/bin/env node

import { isEmpty } from "@banjoanton/utils";
import { Args, argv } from "./cli";
import { loadConfig } from "./config";
import { setDebug } from "./runtime";
import { FeatureService } from "./services/FeatureService";
import { GitService } from "./services/GitService";
import { LogService } from "./services/LogService";

const main = async (args: Args) => {
    const config = await loadConfig();

    if (!config) {
        LogService.warning("⚠️ No config found");
        return;
    }

    if (config?.debug) setDebug();

    LogService.debug("Config found");

    const hook = args.flags.type;

    if (!GitService.isGitHook(hook)) {
        LogService.error("Invalid hook type");
        return;
    }

    if (!GitService.hookExists(hook)) {
        LogService.error("Hook does not exist");
        return;
    }

    LogService.debug(`Hook type found: ${args.flags.type}`);

    const features = FeatureService.getFeatures(hook);
    if (isEmpty(features)) {
        LogService.debug("No features enabled for this hook");
        return;
    }

    LogService.debug(`Features enabled for this hook: ${features}`);

    LogService.debug("Running feature handlers");

    for (const feature of features) {
        LogService.debug(`Looking for handler for feature: ${feature}`);
        const handler = FeatureService.getHandler(feature);

        if (!handler) {
            LogService.error(`No handler found for feature: ${feature}`);
            continue;
        }

        LogService.debug(`Found handler for feature: ${feature}`);
        handler(args._);
    }
};

main(argv);
