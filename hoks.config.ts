import { defineConfig } from "./src";

export default defineConfig({
    installOnLockChange: true,
    branchName: false,
    commitMessage: false,
    preCommit: [],
    staged: {
        "*": "nr format",
    },
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: true,
});
