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

export type ConfigType = "package.json" | "js" | "ts" | "json";

export type PackageManagers = "npm" | "yarn" | "pnpm";

export type FullConfig = {
    debug?: boolean;
    installOnLockChange: boolean | InstallOnLockChange;
    staged: Staged;
    commitMessage: Maybe<StringValidator> | false;
    branchName: Maybe<StringValidator> | false;
    preventCommit: string[] | string | false;
    syncBeforePush: boolean;
    enforceConventionalCommits: boolean;
    noTodos: boolean;
    testChanged: boolean;
} & CustomHooks;

export type Handler = (args: string[], options: FullConfig) => Promise<void> | void;

export type FeatureInit = {
    /**
     * The name of the feature.
     */
    name: Feature;
    /**
     * Handler to run the feature.
     */
    handler: Handler;
    /**
     * Hooks to run the feature on. Will be trumped by conditionalHook.
     */
    hooks: GitHook[];
    /**
     * Priority of the feature. Higher number means higher priority.
     */
    priority?: number;
    /**
     * Change used hook to another hook if condition is true
     */
    conditionalHook?: {
        newHooks: GitHook[];
        condition: (options: FullConfig) => boolean;
    };
};

export type Config = Partial<FullConfig>;
