import { FEATURES, GIT_HOOKS } from "../constants";

type InstallOnLockChange = {
    prompt: boolean;
    installation: "show" | "hide" | "spinner";
    noText: boolean;
};

type Staged =
    | {
          [path: string]: string[] | string;
      }
    | false;

export type FullConfig = {
    debug: boolean;
    installOnLockChange: boolean | InstallOnLockChange;
    staged: Staged;
};

export type Config = Partial<FullConfig>;

export type GitHook = (typeof GIT_HOOKS)[number];
export type Feature = (typeof FEATURES)[number];
export type Handler = (args: string[], options: FullConfig) => Promise<void> | void;

export type FeatureInit = {
    name: Feature;
    handler: Handler;
    hooks: GitHook[];
};
