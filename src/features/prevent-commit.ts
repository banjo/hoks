import { isDefined, toArray } from "@banjoanton/utils";
import { FeatureService } from "../services/FeatureService";
import { LogService } from "../services/LogService";
import { Handler } from "../types/types";
import { executeCommand, exit } from "../utils";

const handler: Handler = async (args, options) => {
    const { preventCommit: config } = options;

    if (!isDefined(config) || config === false) {
        LogService.debug("No prevent commit config defined");
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

    const shouldPrevent = toArray(config).includes(branchName);

    if (shouldPrevent) {
        LogService.error(`Committing directly to branch ${branchName} is not allowed`);
        exit(1);
    }
};

FeatureService.addFeature({
    handler: handler,
    hooks: ["pre-commit"],
    name: "preventCommit",
});
