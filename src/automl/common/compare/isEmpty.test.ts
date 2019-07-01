import { isEmpty } from "./isEmpty";

describe("isEmpty", () => {
    it("should return true for undefined", () => {
        const result = isEmpty(undefined);
        expect(result)
            .toBe(true);
    });
    it("should return true for null", () => {
        const result = isEmpty(null);
        expect(result)
            .toBe(true);
    });
    it("should return false for number", () => {
        const result = isEmpty(0);
        expect(result)
            .toBe(false);
    });
    it("should return false for string", () => {
        const result = isEmpty("");
        expect(result)
            .toBe(false);
    });
});
