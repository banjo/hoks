import { isBoolean } from "@banjoanton/utils";
import { FeatureService } from "../services/feature-service";
import type { Handler } from "../types/types";

const handler: Handler = async (args, options) => {
    const settings = options.installOnLockChange;

    if (!process.stdout.isTTY) return;

    const runImport = await import("git-install-hook");
    const run = runImport.run;

    // strange config due to being a CLI application at first
    const config = {
        _: [{ "--": [] }] as never,
        command: undefined,
        flags: {
            debug: options.debug ?? false,
            prompt: false,
            help: undefined,
            installation: "show",
            noText: false,
            version: undefined,
        },
        showHelp: {} as never,
        showVersion: () => 0,
        unknownFlags: {},
    };

    if (!isBoolean(settings)) {
        config.flags = {
            ...config.flags,
            prompt: settings?.prompt ?? false,
            installation: settings?.installation ?? "show",
            noText: settings?.noText ?? false,
        };
    }
    run(config);
};

FeatureService.addFeature({
    handler,
    hooks: ["post-checkout", "post-merge"],
    name: "installOnLockChange",
});
