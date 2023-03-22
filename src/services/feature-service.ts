import { FeatureInit, FullConfig, GitHook } from "../types/types";

const features: FeatureInit[] = [];

const addFeature = (feature: FeatureInit) => features.push(feature);

const getFeatures = (hook: GitHook, config: FullConfig) =>
    features.filter(feature => {
        const conf = config[feature.name];

        if (!conf) return false;

        return feature.hooks.includes(hook);
    });

const getFeature = (name: string) => features.filter(feature => feature.name === name);

const getAllFeatures = () => features;

export const FeatureService = {
    addFeature,
    getFeatures,
    getFeature,
    getAllFeatures,
};
