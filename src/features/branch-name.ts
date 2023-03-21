import { isDefined } from "@banjoanton/utils";
import { FeatureService } from "../services/FeatureService";
import { LogService } from "../services/LogService";
import { Handler, StringValidator } from "../types/types";
import { executeCommand, exit, handleCustomMessage } from "../utils";

const checkMessage = (message: string, config: StringValidator): boolean => {
    LogService.debug(`Checking commit message: ${message}`);

    if (!new RegExp(config.pattern).test(message)) {
        return false;
    }

    LogService.debug(`Commit message matches pattern: ${config.pattern}`);
    return true;
};

const handler: Handler = async (args, options) => {
    const { branchName: config } = options;

    if (!isDefined(config) || config === false) {
        LogService.debug("No branch name patterns defined");
        return;
    }

    const branchNameResponse = await executeCommand("git rev-parse --abbrev-ref HEAD");
    const branchName = branchNameResponse?.stdout;

    if (!isDefined(branchName)) {
        LogService.error("Could not get branch name");
        exit(1);
        return;
    }

    LogService.debug(`Branch name: ${branchName}`);

    const { pattern, message } = config;
    const success = checkMessage(branchName, { pattern, message });

    if (!success) {
        LogService.error(handleCustomMessage(message));
        exit(1);
    }
};

FeatureService.addFeature({
    handler: handler,
    hooks: ["pre-commit"],
    name: "branchName",
});