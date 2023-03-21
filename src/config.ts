import { cosmiconfig } from "cosmiconfig";
import { APP_NAME, DEFAULT_CONFIG } from "./constants";
import { FullConfig } from "./types/types";

const explorer = cosmiconfig(APP_NAME);

export const loadConfig = async (): Promise<FullConfig> => {
    const result = await explorer.search();
    const userConfig = result?.config?.default;

    return { ...DEFAULT_CONFIG, ...userConfig };
};
