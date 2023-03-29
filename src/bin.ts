#!/usr/bin/env node

import { Args, argv } from "./cli";
import { loadConfig } from "./config";
import "./features";
import { setDebug } from "./runtime";
import { LogService } from "./services/log-service";

import * as dotenv from "dotenv";
import { RunService } from "./services/run-service";
dotenv.config();

const main = async (args: Args) => {
    const shouldInit = args.flags.init;
    const config = await loadConfig();

    if (!config && !shouldInit) {
        LogService.warning("No config found, add --init to create a new config");
        return;
    }

    if (config?.debug || args.flags.debug) setDebug();

    if (args.flags.clean) {
        await RunService.clean();
        return;
    }

    if (shouldInit) {
        await RunService.initConfig(args, config);
        return;
    }

    await RunService.runHandler(args, config);
};

main(argv);
