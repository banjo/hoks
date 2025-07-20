import p from "picocolors";
import type { Config } from "./types/types";

export const standout = (text: string) => p.yellow(text);

export const handleCustomMessage = (message: string | ((pc: typeof p) => string)) => {
    if (typeof message === "function") {
        const defaultMessage = message(p);
        return p.white(defaultMessage);
    }
    return message;
};

export const defineConfig = (config: Config) => config;
