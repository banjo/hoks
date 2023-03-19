import { installOnLockChange } from "./features/install-on-lock-change";
import { Feature, GitHook, Handler } from "./types";

export const gitHookToFeature: Partial<Record<GitHook, Feature[]>> = {
    "post-checkout": ["install-on-lock-change"],
};

export const featureToHandler: Record<Feature, Handler> = {
    "install-on-lock-change": installOnLockChange,
};
