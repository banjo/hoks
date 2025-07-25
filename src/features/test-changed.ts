import { isDefined } from "@banjoanton/utils";
import type { Maybe } from "@banjoanton/utils";
import fs from "node:fs/promises";
import path from "node:path";
import { FeatureService } from "../services/feature-service";
import { LogService } from "../services/log-service";
import type { Handler } from "../types/types";
import { FileUtil } from "../utils/file-util";
import { ShellUtil } from "../utils/shell-util";

type TestRunner = "jest" | "vitest";

const testRunnerToCommand: Record<TestRunner, string> = {
    jest: "jest --onlyChanged",
    vitest: "vitest --changed --watch=false",
};

const detectTestRunner = async (): Promise<Maybe<TestRunner>> => {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJsonExists = await FileUtil.pathExists(packageJsonPath);

    if (!packageJsonExists) return undefined;

    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson.scripts && packageJson.scripts.test) {
        if (packageJson.scripts.test.includes("vitest")) return "vitest";
        if (packageJson.scripts.test.includes("jest")) return "jest";
    }

    if (packageJson.dependencies || packageJson.devDependencies) {
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        if (deps.vitest) return "vitest";
        if (deps.jest) return "jest";
    }

    const jestConfigFiles = await FileUtil.globby("jest.config.*");
    if (jestConfigFiles.length > 0) return "jest";

    const vitestConfigFiles = await FileUtil.globby("vitest.config.*");
    if (vitestConfigFiles.length > 0) return "vitest";

    return undefined;
};

const testChangedHandler: Handler = async (args, options) => {
    const { testChanged: config } = options;

    if (!isDefined(config) || config === false) {
        LogService.debug("No related tests check enabled");
    }

    const testRunner = await detectTestRunner();

    if (!testRunner) {
        LogService.error("No test runner detected");
        return;
    }

    const testRunnerCommand = testRunnerToCommand[testRunner];

    const action = await ShellUtil.executeCommand({
        command: testRunnerCommand,
        options: { stdio: "inherit" },
    });

    if (!action) {
        LogService.error("Failed to run changed tests");
        process.exit(1);
    }

    LogService.debug("Successfully ran changed tests");
};

FeatureService.addFeature({
    handler: testChangedHandler,
    hooks: ["pre-commit"],
    name: "testChanged",
    conditionalHook: {
        newHooks: ["commit-msg"],
        condition: config => !!config.enforceConventionalCommits || !!config.commitMessage,
    },
    priority: 10,
});
