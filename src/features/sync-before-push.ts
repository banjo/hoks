import { isDefined } from "@banjoanton/utils";
import { FeatureService } from "../services/feature-service";
import { LogService } from "../services/log-service";
import { Handler } from "../types/types";
import { executeCommand } from "../utils";

const mapShellToHistoryFile: Record<string, string> = {
    zsh: "~/.zsh_history",
    bash: "~/.bash_history",
};

const isForcePush = async () => {
    const currentShellAction = await executeCommand("echo $SHELL", { shell: true });
    if (!currentShellAction.stdout) {
        LogService.debug("Could not get current shell, assuming not force push");
        return false;
    }

    const currentShell = currentShellAction.stdout.split("/").pop();
    if (!currentShell) {
        LogService.debug("Could not get current shell, assuming not force push");
        return false;
    }

    LogService.debug(`Current shell: ${currentShell}`);

    const historyFile = mapShellToHistoryFile[currentShell];

    if (!historyFile) {
        LogService.debug("Could not get history file, assuming not force push");
        return false;
    }

    LogService.debug(`History file: ${historyFile}`);

    const latestCommandAction = await executeCommand(`cat ${historyFile} | tail -1`, {
        shell: true,
    });
    const latestCommand = latestCommandAction?.stdout;

    if (!latestCommand) {
        LogService.debug("Could not get latest command, assuming not force push");
        return false;
    }

    LogService.debug(`Latest command: ${latestCommand}`);

    const isForce = latestCommand.includes("--force");

    LogService.debug(`Is force push: ${isForce}`);

    return isForce;
};

const handler: Handler = async (args, options) => {
    const { syncBeforePush: config } = options;

    if (!config) return;

    LogService.info("Syncing branch before push");

    const branchNameResponse = await executeCommand("git rev-parse --abbrev-ref HEAD");
    const branchName = branchNameResponse?.stdout;

    if (!isDefined(branchName)) {
        LogService.error("Could not get branch name");
        return;
    }

    const isPushWithForce = await isForcePush();

    if (isPushWithForce) {
        LogService.info("Force push detected, skipping sync");
        return;
    }

    const syncResponse = await executeCommand(`git pull origin ${branchName}`);
    if (syncResponse?.exitCode !== 0) {
        LogService.error("Could not sync branch");
        return;
    }

    LogService.success("Branch synced");
};

FeatureService.addFeature({
    handler: handler,
    hooks: ["pre-push"],
    name: "syncBeforePush",
});
