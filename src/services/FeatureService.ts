import { FeatureInit, GitHook } from "../types";

const features: FeatureInit[] = [];

const addFeature = (feature: FeatureInit) => features.push(feature);

const getFeatures = (hook: GitHook) => features.filter(feature => feature.hooks.includes(hook));

const getFeature = (name: string) => features.filter(feature => feature.name === name);

export const FeatureService = {
    addFeature,
    getFeatures,
    getFeature,
};
