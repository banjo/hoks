import { isDefined } from "@banjoanton/utils";
import { FeatureService } from "../services/FeatureService";
import { LogService } from "../services/LogService";
import { Handler } from "../types/types";
import { executeCommand } from "../utils";

const handler: Handler = async (args, options) => {
    const { syncBeforePush: config } = options;

    if (!config) return;

    LogService.info("Syncing branch before push");

    const branchNameResponse = await executeCommand("git rev-parse --abbrev-ref HEAD");
    const branchName = branchNameResponse?.stdout;

    if (!isDefined(branchName)) {
        LogService.error("Could not get branch name");
        return;
    }

    const syncResponse = await executeCommand(`git pull origin ${branchName}`);
    if (syncResponse?.exitCode !== 0) {
        LogService.error("Could not sync branch");
    }

    LogService.success("Branch synced");
};

FeatureService.addFeature({
    handler: handler,
    hooks: ["pre-push"],
    name: "syncBeforePush",
});
