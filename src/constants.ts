import { FullConfig } from "./types/types";

export const APP_NAME = "hoks";

export const GIT_HOOKS = [
    "applypatch-msg",
    "pre-applypatch",
    "post-applypatch",
    "pre-commit",
    "pre-merge-commit",
    "prepare-commit-msg",
    "commit-msg",
    "post-commit",
    "pre-rebase",
    "post-checkout",
    "post-merge",
    "pre-push",
    "pre-receive",
    "update",
    "proc-receive",
    "post-receive",
    "post-update",
    "reference-transaction",
    "push-to-checkout",
    "pre-auto-gc",
    "post-rewrite",
    "sendemail-validate",
    "fsmonitor-watchman",
    "p4-changelist",
    "p4-prepare-changelist",
    "p4-post-changelist",
    "p4-pre-submit",
    "post-index-change",
] as const;

export const GIT_HOOKS_CAMEL_CASE = [
    "applyPatchMsg",
    "preApplyPatch",
    "postApplyPatch",
    "preCommit",
    "preMergeCommit",
    "prepareCommitMsg",
    "commitMsg",
    "postCommit",
    "preRebase",
    "postCheckout",
    "postMerge",
    "prePush",
    "preReceive",
    "update",
    "procReceive",
    "postReceive",
    "postUpdate",
    "referenceTransaction",
    "pushToCheckout",
    "preAutoGc",
    "postRewrite",
    "sendEmailValidate",
    "fsMonitorWatchman",
    "p4Changelist",
    "p4PrepareChangelist",
    "p4PostChangelist",
    "p4PreSubmit",
    "postIndexChange",
] as const;

export const FEATURES = [
    "installOnLockChange",
    "staged",
    "commitMessage",
    "branchName",
    "preventCommit",
    "syncBeforePush",
    "enforceConventionalCommits",
    "noTodos",
] as const;

export const DEFAULT_CONFIG: FullConfig = {
    installOnLockChange: true,
    staged: false,
    commitMessage: undefined,
    branchName: undefined,
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: false,
    noTodos: false,
};

export const EXAMPLE_CONFIG: FullConfig = {
    installOnLockChange: true,
    branchName: {
        pattern: "^feature/.+",
        message: "Branch name must start with 'feature/'",
    },
    commitMessage: false,
    preCommit: ["npm run test"],
    staged: {
        "*": "nr format",
    },
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: true,
    noTodos: false,
};
