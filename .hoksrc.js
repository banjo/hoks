export default {
    debug: true,
    installOnLockChange: true,
    branchName: false,
    commitMessage: false,
    preCommit: [],
    staged: {
        "*": "nr format",
    },
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: false,
};
