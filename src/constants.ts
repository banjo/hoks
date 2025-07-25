import type { FullConfig } from "./types/types";

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
    "testChanged",
] as const;

export const DEFAULT_CONFIG: FullConfig = {
    installOnLockChange: false,
    staged: false,
    commitMessage: false,
    branchName: false,
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: false,
    noTodos: false,
    testChanged: false,
    include: [],
};

export const EXAMPLE_CONFIG: FullConfig = {
    include: [],
    installOnLockChange: true,
    branchName: {
        pattern: "^feature/.+",
        message: "Branch name must start with 'feature/'",
    },
    commitMessage: false,
    preCommit: ["npm run test"],
    staged: {
        "*": "npm run format",
        "*.{ts,js}": "npm run lint",
    },
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: false,
    noTodos: false,
    testChanged: false,
};
