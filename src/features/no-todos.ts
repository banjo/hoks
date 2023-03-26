import { isDefined } from "@banjoanton/utils";
import fs from "node:fs/promises";
import { FeatureService } from "../services/feature-service";
import { GitService, GitStagedFiles } from "../services/git-service";
import { LogService } from "../services/log-service";
import { Handler } from "../types/types";

const checkForTodoComments = async (files: GitStagedFiles[]): Promise<boolean> => {
    for (const file of files) {
        const { filename } = file;
        const fileContent = await fs.readFile(filename, "utf8");

        if (/\/\/\s?todo:/gi.test(fileContent)) {
            LogService.error(`Found todo comment in file: ${filename}`);
            return true;
        }
    }
    return false;
};

const todoHandler: Handler = async (args, options) => {
    const { noTodos: config } = options;

    if (!isDefined(config) || config === false) {
        LogService.debug("No todo check enabled");
        return;
    }

    const files = await GitService.getStagedFiles();

    LogService.debug(`Checking for todo comments in the code`);

    const foundTodoComment = await checkForTodoComments(files);

    if (foundTodoComment) {
        LogService.debug(`Found todo comment in staged files`);
        process.exit(1);
    }
};

FeatureService.addFeature({
    handler: todoHandler,
    hooks: ["pre-commit"],
    name: "noTodos",
    priority: 10,
});
