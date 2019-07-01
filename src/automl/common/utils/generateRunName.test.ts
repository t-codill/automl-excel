import { generateRunName } from "./generateRunName";

describe("generateRunName", () => {
    it("should return N/A with undefined", () => {
        const names = generateRunName(undefined);
        expect(names)
            .toBe("<N/A>");
    });
    it("should return N/A with out property", () => {
        const names = generateRunName({ runId: "automl_1234" });
        expect(names)
            .toBe("<N/A>");
    });
    it("should return N/A without required properties", () => {
        const input = {
            runTemplate: "automl_child",
        };
        const names = generateRunName({ properties: input });
        expect(names)
            .toBe("<N/A>");
    });
    it("should return run_preprocessor if without run_algorithm", () => {
        const input = {
            run_preprocessor: "AAA",
        };
        const names = generateRunName({ properties: input });
        expect(names)
            .toBe("AAA");
    });
    it("should return run_algorithm if without run_preprocessor", () => {
        const input = {
            run_algorithm: "BBB"
        };
        const names = generateRunName({ properties: input });
        expect(names)
            .toBe("BBB");
    });
    it("should return combination if with both", () => {
        const input = {
            run_preprocessor: "AAA",
            run_algorithm: "BBB"
        };
        const names = generateRunName({ properties: input });
        expect(names)
            .toBe("AAA, BBB");
    });
});
