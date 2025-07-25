import { isDefined } from "@banjoanton/utils";
import fs from "node:fs/promises";
import { FeatureService } from "../services/feature-service";
import { LogService } from "../services/log-service";
import type { Handler, StringValidator } from "../types/types";
import { handleCustomMessage } from "../utils";

const checkMessage = (message: string, config: StringValidator): boolean => {
    LogService.debug(`Checking commit message: ${message}`);

    if (!new RegExp(config.pattern).test(message)) {
        return false;
    }

    LogService.debug(`Commit message matches pattern: ${config.pattern}`);
    return true;
};

const handler: Handler = async (args, options) => {
    const { commitMessage: config } = options;

    if (!isDefined(config) || config === false) {
        LogService.debug("No commit message patterns defined");
        return;
    }

    const commitFile = args[0];

    if (!commitFile) {
        LogService.error(
            "No commit file provided. Please provide a commit message file as the first argument."
        );
        process.exit(1);
    }

    const commitMessage = await fs.readFile(commitFile, "utf8");

    LogService.debug(`Commit message: ${commitMessage}`);

    const { pattern, message } = config;
    const success = checkMessage(commitMessage, { pattern, message });

    if (!success) {
        LogService.error(handleCustomMessage(message));
        process.exit(1);
    }
};

FeatureService.addFeature({
    handler,
    hooks: ["commit-msg"],
    name: "commitMessage",
    priority: 15,
});
