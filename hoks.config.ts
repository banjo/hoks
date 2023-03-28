import { defineConfig } from "./src";

export default defineConfig({
    debug: true,
    installOnLockChange: true,
    branchName: false,
    commitMessage: false,
    preCommit: [],
    staged: {
        "*": "nr format",
        "*.{ts,js}": "nr format",
    },
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: false,
    noTodos: true,
    testChanged: false,
});
