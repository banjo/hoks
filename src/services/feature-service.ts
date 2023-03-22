import { FeatureInit, FullConfig, GitHook } from "../types/types";

const features: FeatureInit[] = [];

const addFeature = (feature: FeatureInit) => features.push(feature);

const getFeatures = (hook: GitHook, config: FullConfig) =>
    features.filter(feature => {
        const conf = config[feature.name];

        if (!conf) return false;

        const includedInDefaultHooks = feature.hooks.includes(hook);

        if (!feature.conditionalHook) {
            return includedInDefaultHooks;
        }

        const { newHooks, condition } = feature.conditionalHook;

        if (condition(config) && newHooks.includes(hook)) {
            return true;
        }

        if (condition(config)) {
            return false;
        }

        return includedInDefaultHooks;
    });

const getFeature = (name: string) => features.filter(feature => feature.name === name);

const getAllFeatures = () => features;

export const FeatureService = {
    addFeature,
    getFeatures,
    getFeature,
    getAllFeatures,
};
