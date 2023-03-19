import { cosmiconfig } from "cosmiconfig";
import { APP_NAME } from "./constants";
import { Config } from "./types";

const explorer = cosmiconfig(APP_NAME);

export const loadConfig = async (): Promise<Config> => {
    const result = await explorer.search();
    return result?.config;
};
