import { findUp } from "find-up";
import fs from "node:fs/promises";
import path from "node:path";

const findUpFile = async (filename: string, cwd?: string): Promise<string | undefined> =>
    findUp(filename, { cwd: cwd || process.cwd() });

const findUpDir = async (dirname: string, cwd?: string): Promise<string | undefined> =>
    findUp(
        async directory => {
            const dirPath = path.join(directory, dirname);
            try {
                const stat = await fs.stat(dirPath);
                return stat.isDirectory() ? dirPath : undefined;
            } catch {
                return undefined;
            }
        },
        { cwd: cwd || process.cwd() }
    );

export const PathService = {
    findUpFile,
    findUpDir,
};
