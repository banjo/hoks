import { beforeEach, describe, expect, it } from "vitest";
import { GitService } from "../git-service";
import { EXAMPLE_CONFIG } from "../../constants";
import { produce } from "@banjoanton/utils";
import type { FullConfig } from "../../types/types";

describe("hookTemplate", () => {
    let config: FullConfig;
    beforeEach(() => {
        process.env.HOKS_ENV = "";
        config = produce(EXAMPLE_CONFIG, draft => draft);
    });

    it("should generate an unconditional hook if include is not set", () => {
        const result = GitService.hookTemplate("pre-commit", config);
        expect(result).toContain("hoks --type pre-commit");
        expect(result).not.toContain("should_run_hook");
    });

    it("should generate a conditional hook if include is set", () => {
        const configWithInclude = produce(EXAMPLE_CONFIG, draft => {
            draft.include = ["apps/web", "src/features"];
        });
        const result = GitService.hookTemplate("pre-commit", configWithInclude);
        expect(result).toContain("should_run_hook");
        expect(result).toContain("apps/web");
        expect(result).toContain("src/features");
        expect(result).toContain("hoks --type pre-commit");
        expect(result).toContain("if should_run_hook");
    });
});
