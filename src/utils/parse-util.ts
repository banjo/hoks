import { parse } from "@typescript-eslint/typescript-estree";
import jiti from "jiti";
import { LogService } from "../services/log-service";

const cwd = process.cwd();
const jitiFile = jiti(cwd);

type Options = Record<string, string | boolean>;

/**
 * Parse the exported content of a typescript file, based on the path.
 * @param filePath
 */
const parseTsByFilename = <T>(filePath: string): T | null => {
    try {
        return jitiFile(filePath);
    } catch {
        return null;
    }
};

const parseByCode = (code: string, options?: Options) => {
    try {
        return parse(code, options);
    } catch (error) {
        LogService.debug(`Failed to parse code: ${error}`);
        return null;
    }
};

export const ParseUtil = {
    parseTsByFilename,
    parseByCode,
};
