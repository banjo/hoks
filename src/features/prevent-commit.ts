import { isDefined, toArray } from "@banjoanton/utils";
import { FeatureService } from "../services/feature-service";
import { LogService } from "../services/log-service";
import { Handler } from "../types/types";
import { ShellUtil } from "../utils/shell-util";

const handler: Handler = async (args, options) => {
    const { preventCommit: config } = options;

    if (!isDefined(config) || config === false) {
        LogService.debug("No prevent commit config defined");
        return;
    }

    const branchNameResponse = await ShellUtil.executeCommand({
        command: "git rev-parse --abbrev-ref HEAD",
    });
    const branchName = branchNameResponse?.stdout;

    if (!isDefined(branchName)) {
        LogService.error("Could not get branch name");
        process.exit(1);
    }

    LogService.debug(`Branch name: ${branchName}`);

    const shouldPrevent = toArray(config).includes(branchName);

    if (shouldPrevent) {
        LogService.error(`Committing directly to branch ${branchName} is not allowed`);
        process.exit(1);
    }
};

FeatureService.addFeature({
    handler: handler,
    hooks: ["pre-commit"],
    name: "preventCommit",
    priority: 10,
});
