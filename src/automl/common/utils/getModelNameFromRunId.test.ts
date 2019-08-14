import { getModelNameFromRunId } from "./getModelNameFromRunId";

describe("getModelNameFromRunId", () => {
    it("should return origin if not contains underscore", () => {
        const id = "abc";
        const rg = getModelNameFromRunId(id);
        expect(rg)
            .toBe("abc");
    });
    it("should return result", () => {
        const id = "AutoML_12b6d349-b9ae-40fe-833a-ee6dec8ce54a";
        const rg = getModelNameFromRunId(id);
        expect(rg)
            .toBe("AutoML12b6d349b12b6d349-b9ae-40fe-833a-ee6dec8ce54a");
    });
    it("should return result if not contains question mark", () => {
        const id = "AutoML_12b6d349-b9ae-40fe-833a-ee6dec8ce54a_18";
        const rg = getModelNameFromRunId(id);
        expect(rg)
            .toBe("AutoML12b6d349b18");
    });
});
