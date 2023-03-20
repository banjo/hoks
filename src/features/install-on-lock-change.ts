import { FeatureService } from "../services/FeatureService";
import { Handler } from "../types";

export const handler: Handler = (args: string[]) => {
    console.log(args);
};

FeatureService.addFeature({
    handler: handler,
    hooks: ["post-checkout", "post-merge"],
    name: "installOnLockChange",
});
