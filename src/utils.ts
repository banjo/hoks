import { isEmpty } from "@banjoanton/utils";
import { execa, execaCommand, Options } from "execa";
import { Ora } from "ora";
import p from "picocolors";
import { LogService } from "./services/log-service";
import { Config } from "./types/types";

export const standout = (text: string) => p.yellow(text);

export const handleCustomMessage = (message: string | ((pc: typeof p) => string)) => {
    if (typeof message === "function") {
        const defaultMessage = message(p);
        return p.white(defaultMessage);
    }
    return message;
};

interface CustomExecaError extends Error {
    isExecaError: true;
    stdout: string;
    stderr: string;
    failed: boolean;
    command: string;
    exitCode?: number;
    signal?: string;
}

const isCustomExecaError = (error: unknown): error is CustomExecaError => {
    return Object.prototype.hasOwnProperty.call(error, "stdout");
};

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
};

export const execute = async ({
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

export const executeCommand = async ({
    command,
    options,
    spinner,
    exitOnFail = false,
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

export const defineConfig = (config: Config) => {
    return config;
};
