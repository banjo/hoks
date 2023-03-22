import { execa, execaCommand, Options } from "execa";
import p from "picocolors";
import { LogService } from "./services/log-service";

export const standout = (text: string) => p.yellow(text);

export const handleCustomMessage = (message: string | ((pc: typeof p) => string)) => {
    if (typeof message === "function") {
        const defaultMessage = message(p);
        return p.white(defaultMessage);
    }
    return message;
};

export const exit = (code: number): never => {
    LogService.debug(`Exiting with code ${code}`);
    process.exit(code);
};

export const execute = async (command: string, args?: readonly string[], options?: Options) => {
    try {
        return await execa(command, args, options);
    } catch (error) {
        LogService.error(`Command ${command} failed with args ${args}`);
        console.log(error);
        exit(1);
        return null;
    }
};

export const executeCommand = async (command: string, options?: Options) => {
    return await execaCommand(command, options);
};
