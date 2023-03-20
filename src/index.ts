#!/usr/bin/env node
import { isEmpty } from "@banjoanton/utils";
import * as dotenv from "dotenv";
import { Args, argv } from "./cli";
import { loadConfig } from "./config";
import "./features";
import { setDebug } from "./runtime";
import { FeatureService } from "./services/FeatureService";
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

    if (config?.debug) setDebug();

    if (args.flags.init) {
        await GitService.init();
        return;
    }

    const hook = args.flags.type;

    if (!GitService.isGitHook(hook)) {
        LogService.error("Invalid hook type");
        return;
    }

    if (!GitService.hookExists(hook)) {
        LogService.error("Hook does not exist");
        return;
    }

    LogService.debug(`Hook type found: ${standout(hook)}`);

    const features = FeatureService.getFeatures(hook);
    if (isEmpty(features)) {
        LogService.debug("No features created for this hook");
        return;
    }

    LogService.debug(`Features enabled for this hook: ${features.map(f => standout(f.name))}`);

    for (const feature of features) {
        LogService.debug(`Running feature handler for ${standout(feature.name)}`);
        LogService.log(`hoks > ${hook}`);
        feature.handler(args._, config);
    }
};

main(argv);
