import { defineConfig } from "./src";

export default defineConfig({
    debug: true,
    installOnLockChange: true,
    branchName: false,
    commitMessage: false,
    preCommit: ["echo 'pre-commit'"],
    staged: {
        "*": "nr format",
    },
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: true,
});
