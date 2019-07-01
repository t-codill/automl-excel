import { emptyCompare } from "./emptyCompare";

describe("emptyCompare", () => {
    it("should return -1 for a is undefined", () => {
        const result = emptyCompare(undefined, new Date("2019-1-1"));
        expect(result)
            .toBe(-1);
    });
    it("should return 1 for b is undefined", () => {
        const result = emptyCompare(3214421, undefined);
        expect(result)
            .toBe(1);
    });
    it("should return 0 for both a and b are undefined", () => {
        const result = emptyCompare(undefined, undefined);
        expect(result)
            .toBe(0);
    });
    it("should return -1 for a is null", () => {
        const result = emptyCompare(null, new Date("2019-1-1"));
        expect(result)
            .toBe(-1);
    });
    it("should return 1 for b is null", () => {
        const result = emptyCompare(3214421, null);
        expect(result)
            .toBe(1);
    });
    it("should return 0 for both a and b are null", () => {
        const result = emptyCompare(null, null);
        expect(result)
            .toBe(0);
    });
    it("should return undefined if a and b are not empty", () => {
        const result = emptyCompare(1, 2);
        expect(result)
            .toBeUndefined();
    });
});
