import { attempt } from "@banjoanton/utils";
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

const getNearestPackageJson = async (cwd?: string): Promise<string | undefined> => {
    const packageJsonPath = await findUpFile("package.json", cwd);
    if (packageJsonPath) {
        return path.dirname(packageJsonPath);
    }
    return undefined;
};

const getRootDirectory = async (
    markers: string[] = [".git"],
    cwd?: string
): Promise<string | undefined> => {
    const currentDir = cwd ? path.resolve(cwd) : process.cwd();
    let dir = currentDir;

    while (true) {
        for (const marker of markers) {
            const markerPath = path.join(dir, marker);
            try {
                const stat = await fs.stat(markerPath);
                if (stat.isFile() || stat.isDirectory()) {
                    return dir;
                }
            } catch {
                // Marker not found, continue checking parent directory
            }
        }
        const parentDir = path.dirname(dir);
        if (parentDir === dir) break; // Reached filesystem root
        dir = parentDir;
    }
    return undefined;
};

export type FoundConfigFile = {
    path: string;
    filename: string;
    fullPath: string;
};

const findConfigFilesUpToRoot = async (
    filenames: string[],
    options?: { cwd?: string; rootMarkers?: string[] }
): Promise<Array<FoundConfigFile>> => {
    const cwd = options?.cwd ? path.resolve(options.cwd) : process.cwd();
    const rootMarkers = options?.rootMarkers || [".git"];
    const foundConfigs: Array<FoundConfigFile> = [];
    let currentDir = cwd;
    let prevDir = null;
    while (true) {
        // Check for config files at this level
        for (const filename of filenames) {
            await attempt(async () => {
                const fullPath = path.join(currentDir, filename);
                const stat = await fs.stat(fullPath);
                if (stat.isFile()) {
                    foundConfigs.push({ path: currentDir, filename, fullPath });
                }
            });
        }
        // Check for root marker
        let foundRoot = false;
        for (const marker of rootMarkers) {
            const markerPath = path.join(currentDir, marker);
            try {
                const stat = await fs.stat(markerPath);
                if (stat.isFile() || stat.isDirectory()) {
                    foundRoot = true;
                    break;
                }
            } catch {
                // do nothing
            }
        }
        if (foundRoot) break;
        prevDir = currentDir;
        currentDir = path.dirname(currentDir);
        if (prevDir === currentDir) break; // Reached filesystem root
    }
    return foundConfigs;
};

export const PathService = {
    findUpFile,
    findUpDir,
    getNearestPackageJson,
    findConfigFilesUpToRoot,
    getRootDirectory,
};
