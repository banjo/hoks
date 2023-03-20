import { execa, Options } from "execa";
import pc from "picocolors";
import { LogService } from "./services/LogService";

export const standout = (text: string) => pc.yellow(text);

export const exit = (code: number) => {
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
    const [cmd, ...args] = command.split(" ");
    return await execute(cmd, args, options);
};
