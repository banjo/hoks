export default {
    debug: false,
    installOnLockChange: true,
    branchName: undefined,
    commitMessage: undefined,
    preCommit: "nr format",
    staged: {
        "*": "nr lint",
    },
};
