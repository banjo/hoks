import type { CamelCaseGitHook, FullConfig } from "../types/types";
import { ShellUtil } from "../utils/shell-util";
import { LogService } from "./log-service";

const runHook = async (hook: CamelCaseGitHook, args: string[], config: FullConfig) => {
    LogService.debug(`Running hook for ${hook}`);

    const command = config[hook];

    if (!command) {
        LogService.debug("No command found");
        return;
    }

    if (typeof command === "string") {
        LogService.debug(`Running command: ${command}`);
        await ShellUtil.executeCommand({ command, options: { stdio: "inherit", shell: true } });
        return;
    }

    for (const cmd of command) {
        LogService.debug(`Running command: ${cmd}`);
        await ShellUtil.executeCommand({
            command: cmd,
            options: { stdio: "inherit" },
        });
    }

    LogService.log(`Finished custom hook for ${hook}!`);
};

export const CustomService = {
    runHook,
};
