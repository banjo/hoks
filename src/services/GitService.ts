import { includes } from "@banjoanton/utils";
import fs from "node:fs/promises";
import { GIT_HOOKS } from "../constants";
import { GitHook } from "../types";

const isGitHook = (hook: string | undefined): hook is GitHook => {
    return includes(GIT_HOOKS, hook);
};

const hookExists = (hook: GitHook) => fs.access(`.git/hooks/${hook}`);

export const GitService = {
    hookExists,
    isGitHook,
};
