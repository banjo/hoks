import { isDefined } from "@banjoanton/utils";
import { FeatureService } from "../services/feature-service";
import { LogService } from "../services/log-service";
import { Handler, StringValidator } from "../types/types";
import { executeCommand, handleCustomMessage } from "../utils";

const checkMessage = (branch: string, config: StringValidator): boolean => {
    LogService.debug(`Checking branch: ${branch}`);

    if (!new RegExp(config.pattern).test(branch)) {
        LogService.debug(`Branch does not match pattern: ${config.pattern}`);
        return false;
    }

    LogService.debug(`Branch matches pattern: ${config.pattern}`);
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
        process.exit(1);
        return;
    }

    LogService.debug(`Branch name: ${branchName}`);

    const { pattern, message } = config;
    const success = checkMessage(branchName, { pattern, message });

    if (!success) {
        LogService.error(handleCustomMessage(message));
        process.exit(1);
    }
};

FeatureService.addFeature({
    handler: handler,
    hooks: ["pre-commit"],
    name: "branchName",
    priority: 10,
});
