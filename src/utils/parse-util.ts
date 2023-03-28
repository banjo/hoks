import { parse } from "@typescript-eslint/typescript-estree";
import jiti from "jiti";
import * as url from "node:url";
import { LogService } from "../services/log-service";

// @ts-ignore
const __filename = url.fileURLToPath(import.meta.url);
const jitiFile = jiti(__filename, { esmResolve: true });

type Options = Record<string, string | boolean>;

/**
 * Parse the exported content of a typescript file, based on the path.
 * @param filePath
 */
const parseTsByFilename = <T>(filePath: string): T | null => {
    const fullPath = `${process.cwd()}/${filePath}`;
    try {
        return jitiFile(fullPath);
    } catch (error) {
        LogService.debug(`Failed to parse file: ${error}`);
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
