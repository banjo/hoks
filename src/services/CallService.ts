import { includes, isEmpty, Maybe } from "@banjoanton/utils";
import { GIT_HOOKS_CAMEL_CASE } from "../constants";
import { CamelCaseGitHook, FeatureInit, FullConfig, GitHook } from "../types/types";
import { standout } from "../utils";
import { FeatureService } from "./FeatureService";
import { GitService } from "./GitService";
import { LogService } from "./LogService";

export const runFeatures = async (features: FeatureInit[], args: string[], config: FullConfig) => {
    LogService.debug(`Features enabled for this hook: ${features.map(f => standout(f.name))}`);

    for (const feature of features) {
        LogService.debug(`Running feature handler for ${standout(feature.name)}`);
        await feature.handler(args, config);
    }
};

export const isValidHook = (hook: Maybe<string>): hook is GitHook => {
    if (!GitService.isGitHook(hook)) {
        LogService.error("Invalid hook type");
        return false;
    }

    if (!GitService.hookExists(hook)) {
        LogService.error(`Hook file does not exist, try running ${standout("hoks --init")}`);
        return false;
    }

    return true;
};

export const getActiveFeatures = (hook: GitHook, config: FullConfig): Maybe<FeatureInit[]> => {
    const features = FeatureService.getFeatures(hook, config);

    if (isEmpty(features)) {
        LogService.debug("No features created for this hook");
        return undefined;
    }

    LogService.debug(`Features found: ${features.length}}`);

    return features;
};

export const hasCustomHook = (hook: string, config: FullConfig): hook is CamelCaseGitHook => {
    if (!includes(GIT_HOOKS_CAMEL_CASE, hook)) {
        LogService.error(`Invalid hook type: ${hook}}`);
        return false;
    }

    if (!config[hook]) {
        LogService.debug("No custom hook found");
        return false;
    }

    return true;
};

export const CallService = {
    runFeatures,
    isValidHook,
    getActiveFeatures,
    hasCustomHook,
};
