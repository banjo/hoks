import { Maybe } from "@banjoanton/utils";
import { FEATURES, GIT_HOOKS, GIT_HOOKS_CAMEL_CASE } from "../constants";

type InstallOnLockChange = {
    prompt: boolean;
    installation: "show" | "hide" | "spinner";
    noText: boolean;
};

type HookCommand = string[] | string;

export type GitHook = (typeof GIT_HOOKS)[number];
export type CamelCaseGitHook = (typeof GIT_HOOKS_CAMEL_CASE)[number];

export type Feature = (typeof FEATURES)[number];

type Staged =
    | {
          [path: string]: HookCommand;
      }
    | false;

type CustomHooks = Partial<Record<CamelCaseGitHook, HookCommand>>;

type CustomMessage = string | ((pc: typeof import("picocolors")) => string);

export type StringValidator = {
    pattern: string;
    message: CustomMessage;
};

export type FullConfig = {
    debug: boolean;
    installOnLockChange: boolean | InstallOnLockChange;
    staged: Staged;
    commitMessage: Maybe<StringValidator> | false;
    branchName: Maybe<StringValidator> | false;
    preventCommit: string[] | string | false;
} & CustomHooks;

export type Handler = (args: string[], options: FullConfig) => Promise<void> | void;

export type FeatureInit = {
    name: Feature;
    handler: Handler;
    hooks: GitHook[];
    priority?: number;
};

export type Config = Partial<FullConfig>;
