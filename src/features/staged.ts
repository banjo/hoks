import { isEmpty } from "@banjoanton/utils";
import ora from "ora";
import { FeatureService } from "../services/feature-service";
import { GitService } from "../services/git-service";
import { LogService } from "../services/log-service";
import { Handler } from "../types/types";
import { executeCommand, standout } from "../utils";

const handler: Handler = async (args, options) => {
    const { staged } = options;

    if (staged === false) return;

    const stagedFiles = await GitService.getStagedFiles();

    if (isEmpty(stagedFiles)) {
        LogService.debug("No staged files found");
        return;
    }

    const filePaths = stagedFiles.map(file => file.filename);

    LogService.debug(`Staged files: ${filePaths}`);

    const entries = Object.entries(staged);

    if (isEmpty(entries)) {
        LogService.debug("No staged commands found");
        return;
    }

    const imp = await import("minimatch");
    const minimatch = imp.default;

    for (const [matchPath, commands] of entries) {
        LogService.debug(`Checking if ${standout(matchPath)} matches any staged files`);

        const filesToApply = [];
        for (const filePath of filePaths) {
            if (filePath.includes("/") && minimatch(filePath, matchPath)) {
                filesToApply.push(filePath);
                continue;
            }

            const file = filePath.split("/").pop();
            if (file && minimatch(file, matchPath)) filesToApply.push(filePath);
        }

        const spinner = ora();

        if (isEmpty(filesToApply)) {
            LogService.debug(`No files matched ${standout(matchPath)}`);
            continue;
        }

        LogService.debug(`Found ${filesToApply.length} files to apply command(s) to`);

        if (typeof commands === "string") {
            LogService.debug(`Running command ${standout(commands)}`);
            spinner.start(
                `${standout(commands)} [${standout(matchPath)}] on ${filesToApply.length} ${
                    filesToApply.length > 1 ? "files" : "file"
                }`
            );
            await executeCommand(commands);
            spinner.succeed();
            continue;
        }

        for (const command of commands) {
            spinner.start(`${standout(command)} on ${filesToApply.length} file(s)`);
            LogService.debug(`Running command ${standout(command)}`);
            await executeCommand(command);
            spinner.succeed();
        }

        LogService.debug(`Finished running commands for ${standout(matchPath)}`);
    }

    LogService.log("✅ Done!");
};

FeatureService.addFeature({
    handler: handler,
    hooks: ["pre-commit"],
    name: "staged",
    conditionalHook: {
        newHooks: ["commit-msg"],
        condition: config => !!config.enforceConventionalCommits || !!config.commitMessage,
    },
});
