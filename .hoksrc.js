export default {
    debug: true,
    installOnLockChange: true,
    branchName: false,
    commitMessage: false,
    preCommit: "nr format",
    staged: {
        "*": "nr format",
    },
    preventCommit: false,
    syncBeforePush: true,
};
