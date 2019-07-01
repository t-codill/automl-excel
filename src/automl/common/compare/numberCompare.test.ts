import { numberCompare } from "./numberCompare";

describe("number compare", () => {
    it("should return -1 for 1 < 2", () => {
        const result = numberCompare(1, 2);
        expect(result)
            .toBe(-1);
    });
    it("should return 1 for 2 > 1", () => {
        const result = numberCompare(2, 1);
        expect(result)
            .toBe(1);
    });
    it("should return 0 for 1 == 1", () => {
        const result = numberCompare(1, 1);
        expect(result)
            .toBe(0);
    });
    it("should return -1 for a is nan", () => {
        const result = numberCompare(NaN, 2);
        expect(result)
            .toBe(-1);
    });
    it("should return 1 for b is nan", () => {
        const result = numberCompare(2, NaN);
        expect(result)
            .toBe(1);
    });
    it("should return 1 for a is nan and nanAsMax = true", () => {
        const result = numberCompare(NaN, 2, true);
        expect(result)
            .toBe(1);
    });
    it("should return -1 for a is nan and nanAsMax = true", () => {
        const result = numberCompare(2, NaN, true);
        expect(result)
            .toBe(-1);
    });
    it("should return 0 for both a and b are NaN", () => {
        const result = numberCompare(NaN, NaN);
        expect(result)
            .toBe(0);
    });
});
