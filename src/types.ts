import { FEATURES, GIT_HOOKS } from "./constants";

type FullConfig = {
    debug: boolean;
};

export type Config = Partial<FullConfig>;

export type GitHook = (typeof GIT_HOOKS)[number];
export type Feature = (typeof FEATURES)[number];
export type Handler = (args: string[], options: Config) => Promise<void> | void;

export type FeatureInit = {
    name: string;
    handler: Handler;
    hooks: GitHook[];
};
