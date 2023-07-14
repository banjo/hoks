/* eslint-disable no-empty */
import { includes, uniq } from "@banjoanton/utils";
import fs from "node:fs/promises";
import sgf from "staged-git-files";
import { GIT_HOOKS } from "../constants";
import { packageManagerToExecCommand } from "../maps";
import { isDevelopment } from "../runtime";
import { FullConfig, GitHook } from "../types/types";
import { standout } from "../utils";
import { FileUtil } from "../utils/file-util";
import { ShellUtil } from "../utils/shell-util";
import { FeatureService } from "./feature-service";
import { LogService } from "./log-service";

export type GitStagedFiles = {
    filename: string;
    status: string;
};

const isGitHook = (hook: string | undefined): hook is GitHook => {
    return includes(GIT_HOOKS, hook);
};

const hookExists = async (hook: GitHook) => await FileUtil.pathExists(`.git/hooks/${hook}`);

const hookTemplate = (hook: GitHook, command: string) => `#!/bin/sh
# This file was automatically generated by hoks
# Do not edit this file manually

${isDevelopment() ? "nr start" : `${command} hoks`} --type ${hook} "$@"`;

const writeHook = async (hook: GitHook) => {
    const packageManager = await FileUtil.detectPackageManager();

    await fs.writeFile(
        `.git/hooks/${hook}`,
        hookTemplate(hook, packageManagerToExecCommand[packageManager])
    );
    await fs.chmod(`.git/hooks/${hook}`, 0o755);

    LogService.success(`Successfully added ${standout(hook)} hook`);
};

const initializeHooks = async (config: FullConfig) => {
    LogService.debug("Initializing hoks");
    const features = FeatureService.getActiveFeatures(config);
    LogService.debug(`Found ${features.length} features`);

    const hooks = uniq(features.flatMap(feature => feature.hooks));
    LogService.debug(`Found ${hooks.length} hooks`);

    const updatedPathAction = await ShellUtil.executeCommand({
        command: "git config core.hooksPath .git/hooks/",
    });

    if (!updatedPathAction) {
        LogService.error("Failed to update git hooks path");
        process.exit(1);
    }

    LogService.debug("Updated git hooks path");

    const hooksFolder = ".git/hooks/";
    const hooksFolderExists = await FileUtil.pathExists(hooksFolder);
    if (hooksFolderExists) {
        await fs.rm(hooksFolder, { recursive: true });
    }
    await fs.mkdir(hooksFolder, { recursive: true });

    LogService.debug("Updated hooks directory");

    const updated = [];
    for (const hook of hooks) {
        if (!isGitHook(hook)) {
            LogService.error(`Hook ${standout(hook)} is not a valid git hook`);
            continue;
        }

        await writeHook(hook);
        updated.push(hook);
    }

    const keys = Object.keys(config);
    const customHooks = keys.filter(key => includes(GIT_HOOKS, key));

    if (customHooks.length === 0) {
        LogService.debug("No custom hooks found");
        return;
    }

    LogService.debug(`Found ${customHooks.length} custom hooks in config`);

    for (const hook of customHooks) {
        if (updated.includes(hook)) {
            LogService.debug(`Custom hook ${standout(hook)} already exists`);
            continue;
        }

        await writeHook(hook as GitHook);
    }
};

type Status = "Added" | "Modified" | "Renamed" | "Deleted" | "Untracked";

const getStagedFiles = async (exclude: Status[] = ["Deleted"]): Promise<GitStagedFiles[]> => {
    const files = await sgf();

    return files.filter(file => !exclude.includes(file.status as Status));
};

const cleanHooks = async () => {
    LogService.debug("Cleaning hooks");
    const hooks = await FileUtil.globby(".git/hooks/*");
    for (const hook of hooks) {
        const content = await fs.readFile(hook, "utf8");
        if (!content.includes("hoks")) {
            LogService.debug(`Skipping ${hook}`);
            continue;
        }
        LogService.debug(`Removing ${hook}`);
        await fs.rm(hook);
    }

    LogService.debug("Successfully cleaned hooks");
};

export const GitService = {
    hookExists,
    isGitHook,
    initializeHooks,
    getStagedFiles,
    cleanHooks,
};
