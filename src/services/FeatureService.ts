import { featureToHandler, gitHookToFeature } from "../maps";
import { Feature, GitHook } from "../types";

const getFeatures = (hook: GitHook) => {
    const features = gitHookToFeature[hook];
    return features || [];
};

const getHandler = (feature: Feature) => {
    const handler = featureToHandler[feature];
    return handler;
};

export const FeatureService = {
    getFeatures,
    getHandler,
};
