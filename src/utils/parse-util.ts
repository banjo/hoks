import { parse } from "@typescript-eslint/typescript-estree";
import jiti from "jiti";
import { LogService } from "../services/log-service";

const cwd = process.cwd();
const jitiFile = jiti(cwd);

type ParseAndGenerateServicesOptions = Parameters<typeof parse>[1];

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

const parseByCode = <T extends ParseAndGenerateServicesOptions>(code: string, options?: T) => {
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
