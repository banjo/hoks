import fs from "node:fs/promises";

const fileExists = async (file: string) => {
    try {
        await fs.access(file);
        return true;
    } catch {
        return false;
    }
};

export const FileUtil = {
    fileExists,
};
