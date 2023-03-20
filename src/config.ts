import { cosmiconfig } from "cosmiconfig";
import { APP_NAME, DEFAULT_CONFIG } from "./constants";
import { Config } from "./types";

const explorer = cosmiconfig(APP_NAME);

export const loadConfig = async (): Promise<Config> => {
    const result = await explorer.search();
    const userConfig = result?.config;

    return { ...DEFAULT_CONFIG, ...userConfig };
};
