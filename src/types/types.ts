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

export type PackageManager = "npm" | "yarn" | "pnpm";

export type FullConfig = {
    /**
     * Activate debug mode with verbose logging.
     * @default false
     */
    debug?: boolean;
    /**
     * Prompt for installation when lockfile changes.
     * Can be false or true, or an object with options.
     * @example
     * installOnLockChange: {
     *   installation: "spinner",
     *   prompt: true,
     *   noText: false,
     * }
     */
    installOnLockChange: boolean | InstallOnLockChange;
    /**
     * Command to run on staged files. Can be a string or an array of strings.
     * @example
     * staged: {
     *   "*": "npm run format",
     *   "*.{ts,js}": "npm run lint",
     * }
     */
    staged: Staged;
    /**
     * Commit message validator with regex and custom error message.
     * If false, no validation will be done.
     * @example
     * commitMessage: {
     *   pattern: "^feature/.+",
     *   message: "Commit message must start with 'feature/''",
     * }
     */
    commitMessage: Maybe<StringValidator> | false;
    /**
     * Branch name validator with regex and custom error message.
     * If false, no validation will be done.
     * @example
     * branchName: {
     *   pattern: "^feature/.+",
     *   message: "Branch name must start with 'feature/'",
     * }
     */
    branchName: Maybe<StringValidator> | false;
    /**
     * Branches to prevent committing on. Can be string or array of strings.
     * @example
     * preventCommit: ["master", "main"]
     */
    preventCommit: string[] | string | false;
    /**
     * Run `git pull` before pushing.
     */
    syncBeforePush: boolean;
    /**
     * Enforce conventional commits validation.
     */
    enforceConventionalCommits: boolean;
    /**
     * Prevent committing todos in code.
     */
    noTodos: boolean;
    /**
     * Run tests on changed files.
     */
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
