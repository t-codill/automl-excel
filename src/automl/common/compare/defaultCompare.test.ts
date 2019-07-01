import { defaultCompare } from "./defaultCompare";

describe("default compare", () => {
    it("should return -1 for abc < test", () => {
        const result = defaultCompare("abc", "test");
        expect(result)
            .toBe(-1);
    });
    it("should return 1 for A > #", () => {
        const result = defaultCompare("A", "#");
        expect(result)
            .toBe(1);
    });
    it("should return 0 for a == b", () => {
        const result = defaultCompare("!23", "!23");
        expect(result)
            .toBe(0);
    });
    it("should alphabetical compare, instead of number, 100 < 11", () => {
        const result = defaultCompare("100", "11");
        expect(result)
            .toBe(-1);
    });
});
