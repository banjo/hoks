import { FEATURES, GIT_HOOKS } from "../constants";

type InstallOnLockChange = {
    prompt: boolean;
    installation: "show" | "hide" | "spinner";
    noText: boolean;
};

type HookCommand = string[] | string;

export type GitHook = (typeof GIT_HOOKS)[number];
export type Feature = (typeof FEATURES)[number];

type Staged =
    | {
          [path: string]: HookCommand;
      }
    | false;

type CustomHooks = Partial<Record<GitHook, HookCommand>>;

export type FullConfig = {
    debug: boolean;
    installOnLockChange: boolean | InstallOnLockChange;
    staged: Staged;
} & CustomHooks;

export type Handler = (args: string[], options: FullConfig) => Promise<void> | void;

export type FeatureInit = {
    name: Feature;
    handler: Handler;
    hooks: GitHook[];
};

export type Config = Partial<FullConfig>;
