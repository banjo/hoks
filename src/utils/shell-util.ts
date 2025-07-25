import { isEmpty } from "@banjoanton/utils";
import { execa, execaCommand } from "execa";
import type { Options } from "execa";
import type { Ora } from "ora";
import { LogService } from "../services/log-service";

interface CustomExecaError extends Error {
    isExecaError: true;
    stdout: string;
    stderr: string;
    failed: boolean;
    command: string;
    exitCode?: number;
    signal?: string;
}

const isCustomExecaError = (error: unknown): error is CustomExecaError =>
    Object.prototype.hasOwnProperty.call(error, "stdout");

const handleError = (error: CustomExecaError) => {
    if (!isEmpty(error?.stdout)) {
        LogService.debug("Printing stdout and exiting...");
        LogService.log(error.stdout);
        return null;
    } else if (!isEmpty(error?.stderr)) {
        LogService.debug("Printing stderr and exiting...");
        LogService.log(error.stderr);
        return null;
    }
    LogService.debug("Printing error message and exiting...");
    LogService.error(error.message);
    return null;
};

const defaultOptions: Options = {
    env: { FORCE_COLOR: "true" },
    shell: true,
};
const execute = async ({
    command,
    args,
    options,
    spinner,
    exitOnFail = false,
}: {
    command: string;
    args?: readonly string[];
    options?: Options;
    spinner?: Ora;
    exitOnFail?: boolean;
}) => {
    options = { ...defaultOptions, ...options };
    try {
        return await execa(command, args, options);
    } catch (error) {
        LogService.debug(`Command ${command} failed with args ${args}`);

        if (spinner) spinner.fail();
        if (isCustomExecaError(error)) {
            handleError(error);
        } else if (error instanceof Error) {
            LogService.error(error.message);
        }

        if (exitOnFail) process.exit(1);
        return null;
    }
};

const executeCommand = async ({
    command,
    options,
    spinner,
    exitOnFail = true,
}: {
    command: string;
    options?: Options;
    spinner?: Ora;
    exitOnFail?: boolean;
}) => {
    options = { ...defaultOptions, ...options };
    try {
        return await execaCommand(command, options);
    } catch (error: unknown) {
        LogService.debug(`Command ${command} failed`);
        if (spinner) spinner.fail();
        if (isCustomExecaError(error)) {
            handleError(error);
        } else if (error instanceof Error) {
            LogService.error(error.message);
        }

        if (exitOnFail) process.exit(1);
        return null;
    }
};

export const ShellUtil = {
    execute,
    executeCommand,
};
