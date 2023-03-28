/* eslint-disable no-empty */
import { includes, uniq } from "@banjoanton/utils";
import fs from "node:fs/promises";
import sgf from "staged-git-files";
import { GIT_HOOKS } from "../constants";
import { packageManagerToExecCommand } from "../maps";
import { isDevelopment } from "../runtime";
import { FullConfig, GitHook } from "../types/types";
import { executeCommand, standout } from "../utils";
import { FileUtil } from "../utils/file-util";
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

    const updatedPathAction = await executeCommand("git config core.hooksPath .git/hooks/");

    if (updatedPathAction.exitCode !== 0) {
        LogService.error("Failed to update git hooks path");
        process.exit(1);
    }

    LogService.debug("Updated git hooks path");

    const hooksPathExists = await FileUtil.pathExists(".git/hooks/");

    if (!hooksPathExists) {
        LogService.debug("Git hooks path does not exist, adding it.");
        await fs.mkdir(".git/hooks/");
    }

    LogService.debug("Looking for existing hooks to remove");
    for (const hook of GIT_HOOKS) {
        if (await hookExists(hook)) {
            await fs.rm(`.git/hooks/${hook}`);
            LogService.debug(`Removed ${standout(hook)}`);
        }
    }

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

const getStagedFiles = async (): Promise<GitStagedFiles[]> => {
    return await sgf();
};

export const GitService = {
    hookExists,
    isGitHook,
    initializeHooks,
    getStagedFiles,
};
