export default {
    debug: false,
    installOnLockChange: true,
    branchName: false,
    commitMessage: false,
    preCommit: "nr format",
    staged: {
        "*": "nr format",
    },
    preventCommit: false,
};
