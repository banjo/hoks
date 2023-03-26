import fs from "node:fs/promises";

const fileExists = async (file: string) => {
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

export const FileUtil = {
    fileExists,
    globby,
};
