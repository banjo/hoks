import { FeatureService } from "../services/FeatureService";
import { Handler } from "../types/types";

const handler: Handler = (args, options) => {
    const { {{featureName}}: config } = options;
};

FeatureService.addFeature({
    handler: handler,
    hooks: ["pre-commit"],
    name: "{{featureName}}",
});
