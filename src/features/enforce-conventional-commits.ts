import { isDefined } from "@banjoanton/utils";
import fs from "node:fs/promises";
import { FeatureService } from "../services/feature-service";
import { LogService } from "../services/log-service";
import type { Handler } from "../types/types";

const regex =
    /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([\w.-]+\))?(!)?: ([\w ])+([\S\s]*)/;

const handler: Handler = async (args, options) => {
    const { enforceConventionalCommits: config } = options;

    if (!isDefined(config) || config === false) {
        LogService.debug("Won't enforce conventional commits");
        return;
    }

    const commitFile = args[0];

    if (!isDefined(commitFile)) {
        LogService.error("Could not read commit msg");
        process.exit(1);
    }

    const commitMessage = await fs.readFile(commitFile, "utf8");

    LogService.debug(`Commit message: ${commitMessage}`);

    const matches = regex.exec(commitMessage);

    if (!matches) {
        LogService.error("Commit message does not match conventional commit format");
        process.exit(1);
        return;
    }

    LogService.debug("Commit message matches conventional commit format");
};

FeatureService.addFeature({
    handler,
    hooks: ["commit-msg"],
    name: "enforceConventionalCommits",
    priority: 15,
});
