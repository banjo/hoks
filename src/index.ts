#!/usr/bin/env node
import { isEmpty } from "@banjoanton/utils";
import { Args, argv } from "./cli";
import { loadConfig } from "./config";
import "./features";
import { setDebug } from "./runtime";
import { FeatureService } from "./services/FeatureService";
import { GitService } from "./services/GitService";
import { LogService } from "./services/LogService";

const main = async (args: Args) => {
    const config = await loadConfig();

    if (!config) {
        LogService.warning("No config found");
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

    LogService.debug(`Hook type found: ${hook}`);

    const features = FeatureService.getFeatures(hook);
    if (isEmpty(features)) {
        LogService.debug("No features created for this hook");
        return;
    }

    LogService.debug(`Features enabled for this hook: ${features.map(f => f.name)}`);

    for (const feature of features) {
        LogService.debug(`Running feature handler for ${feature.name}`);
        feature.handler(args._, config);
    }
};

main(argv);
