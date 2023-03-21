import { CamelCaseGitHook, FullConfig } from "../types/types";
import { executeCommand } from "../utils";
import { LogService } from "./LogService";

export const runHook = async (hook: CamelCaseGitHook, args: string[], config: FullConfig) => {
    LogService.debug(`Running hook for ${hook}`);

    const command = config[hook];

    if (!command) {
        LogService.debug("No command found");
        return;
    }

    if (typeof command === "string") {
        LogService.debug(`Running command: ${command}`);
        await executeCommand(command, { stdio: "inherit" });
        return;
    }

    for (const cmd of command) {
        LogService.debug(`Running command: ${cmd}`);
        await executeCommand(cmd, { stdio: "inherit" });
    }

    LogService.log(`Finished custom hook for ${hook}!`);
};

export const CustomService = {
    runHook,
};
