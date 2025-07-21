import { defineConfig } from "./src";

export default defineConfig({
    include: ["src/"],
    debug: false,
    installOnLockChange: true,
    branchName: false,
    commitMessage: false,
    preCommit: [],
    staged: {
        "*": "prettier --write --ignore-unknown",
        "*.{ts,js}": "eslint --ext .js,.ts,.json",
    },
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: false,
    noTodos: false,
    testChanged: false,
});
