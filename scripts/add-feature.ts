import { template } from "@banjoanton/utils";
import { camelCase, paramCase } from "change-case";
import fs from "node:fs/promises";
import { DEFAULT_CONFIG, FEATURES } from "../src/constants";

const spaces = (count = 4) => " ".repeat(count);
const importStatement = (feature: string) => `import "./features/${feature}";`;

const main = async () => {
    // get feature name from cli
    const featureName = process.argv[2];

    if (!featureName) {
        throw new Error("No feature name provided");
    }

    const featureNameCamelCase = camelCase(featureName);
    const featureNameKebabCase = paramCase(featureName);

    // add feature to constants
    const updatedFeatures = [...FEATURES, featureNameCamelCase];
    const regexForFeatures = /export const FEATURES = \[([\S\s]*?)] as const;/;

    const constantsContent = await fs.readFile("./src/constants.ts", "utf8");
    const matched = constantsContent.match(regexForFeatures)?.[0];

    if (!matched) {
        throw new Error("No match for features found");
    }

    const updatedFileContent = constantsContent.replace(
        matched,
        `export const FEATURES = [\n${spaces()}${updatedFeatures
            .map(feature => `"${feature}"`)
            .join(`,\n${spaces()}`)},\n] as const;`
    );

    // add default config to constants.ts (same file as above)
    const regexForDefaultConfig = /export const DEFAULT_CONFIG: FullConfig = {([\S\s]*?)};/;
    const defaultConfigMatch = constantsContent.match(regexForDefaultConfig)?.[0];

    if (!defaultConfigMatch) {
        throw new Error("No match for default config found");
    }

    const fullConfigEntries = Object.entries(DEFAULT_CONFIG).map(([key, value]) => {
        return `${key}: ${JSON.stringify(value)},`;
    });
    fullConfigEntries.push(`${featureNameCamelCase}: false,`);

    const newConfig = `export const DEFAULT_CONFIG: FullConfig = {\n${fullConfigEntries
        .map(entry => `${spaces(4)}${entry}`)
        .join("\n")}\n};`;

    const updatedDefaultConfig = updatedFileContent.replace(defaultConfigMatch, newConfig);
    await fs.writeFile("./src/constants.ts", updatedDefaultConfig);

    // add feature file to features folder
    const path = `./src/features/${featureNameKebabCase}.ts`;
    const fileTemplate = await fs.readFile("./templates/handler.ts", "utf8");
    const updatedFile = template(fileTemplate, { featureName: featureNameCamelCase });
    await fs.writeFile(path, updatedFile);

    // add features to features.ts
    const featuresSnakeCase = updatedFeatures.map(s => paramCase(s));
    const updatedFeaturesImport = featuresSnakeCase
        .map(f => importStatement(f))
        .sort((a, b) => a.localeCompare(b))
        .join("\n");
    await fs.writeFile("./src/features.ts", `${updatedFeaturesImport}\n`);

    // add typescript type to types.ts in FullConfig type
    const typesFile = await fs.readFile("./src/types/types.ts", "utf8");
    const regexForFullConfig = /export type FullConfig = {([\S\s]*?)} & CustomHooks;/;
    const fullConfigMatch = typesFile.match(regexForFullConfig)?.[0];

    if (!fullConfigMatch) {
        throw new Error("No match for FullConfig found");
    }

    const entries = fullConfigMatch
        .split("\n")
        .slice(1, -1)
        .map(line => line.trim());

    const updatedEntries = [...entries, `${featureNameCamelCase}: boolean;`];

    const updatedTypesFile = typesFile.replace(
        fullConfigMatch,
        `export type FullConfig = {\n${updatedEntries
            .map(entry => `${spaces(4)}${entry}`)
            .join("\n")}\n} & CustomHooks;`
    );

    await fs.writeFile("./src/types/types.ts", updatedTypesFile);
};

main();
