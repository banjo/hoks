import { FEATURES, GIT_HOOKS } from "./constants";

type FullConfig = {
    debug: boolean;
};

export type Config = Partial<FullConfig>;

export type GitHook = (typeof GIT_HOOKS)[number];
export type Feature = (typeof FEATURES)[number];
export type Handler = (args: string[]) => Promise<void> | void;
