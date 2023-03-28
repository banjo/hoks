import fs from "node:fs/promises";
import { PackageManager } from "../types/types";

const pathExists = async (file: string) => {
    try {
        await fs.access(file);
        return true;
    } catch {
        return false;
    }
};

const globby = async (pattern: string) => {
    const g = await import("globby");
    return g.globby(pattern);
};

const detectPackageManager = async (): Promise<PackageManager> => {
    if (await pathExists("yarn.lock")) return "yarn";
    if (await pathExists("pnpm-lock.yaml")) return "pnpm";
    return "npm";
};

export const FileUtil = {
    pathExists,
    globby,
    detectPackageManager,
};
