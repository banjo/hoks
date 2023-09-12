import { isDefined, isNil } from "@banjoanton/utils";
import fs from "node:fs/promises";
import { FeatureService } from "../services/feature-service";
import { GitService, GitStagedFiles } from "../services/git-service";
import { LogService } from "../services/log-service";
import { Handler } from "../types/types";
import { standout } from "../utils";
import { ParseUtil } from "../utils/parse-util";

const REGEX_VALID_FILENAMES = /^.+\.(ts|js|cjs|mjs)$/;

const checkForTodoComments = async (files: GitStagedFiles[]): Promise<boolean> => {
    for (const file of files) {
        const { filename } = file;

        if (!REGEX_VALID_FILENAMES.test(filename)) {
            LogService.debug(`${standout(filename)} is not a valid to check for comments in.`);
            continue;
        }

        LogService.debug(`Checking ${standout(filename)}`);
        const fileContent = await fs.readFile(filename, "utf8");

        const ast = ParseUtil.parseByCode(fileContent, { comment: true });

        if (isNil(ast)) {
            LogService.debug(`Could not parse file: ${standout(filename)}`);
            continue;
        }

        const comments = ast.comments ?? [];

        for (const comment of comments) {
            if (comment.value.toLowerCase().includes("todo")) {
                LogService.error(`Found todo comment in file: ${filename}`);
                return true;
            }
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

    LogService.info("Checking for todos in staged files...");

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
