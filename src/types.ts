import { FEATURES, GIT_HOOKS } from "./constants";

type InstallOnLockChange = {
    prompt: boolean;
    installation: "show" | "hide" | "spinner";
    noText: boolean;
};

export type FullConfig = {
    debug: boolean;
    installOnLockChange: boolean | InstallOnLockChange;
};

export type Config = Partial<FullConfig>;

export type GitHook = (typeof GIT_HOOKS)[number];
export type Feature = (typeof FEATURES)[number];
export type Handler = (args: string[], options: Config) => Promise<void> | void;

export type FeatureInit = {
    name: Feature;
    handler: Handler;
    hooks: GitHook[];
};
