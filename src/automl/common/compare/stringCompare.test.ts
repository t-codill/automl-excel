import { stringCompare } from "./stringCompare";

describe("string compare", () => {
    it("should return -1 for abc < test", () => {
        const result = stringCompare("abc", "test");
        expect(result)
            .toBe(-1);
    });
    it("should return 1 for A > #", () => {
        const result = stringCompare("A", "#");
        expect(result)
            .toBe(1);
    });
    it("should return 0 for a == b", () => {
        const result = stringCompare("!23", "!23");
        expect(result)
            .toBe(0);
    });
    it("should alphabetical compare, instead of number, 100 < 11", () => {
        const result = stringCompare("100", "11");
        expect(result)
            .toBe(-1);
    });
    it("should return 0 when ignoring case,  A == a", () => {
        const result = stringCompare("A", "a", true);
        expect(result)
            .toBe(0);
    });
    it("should return -1 comparing with case,  A < b", () => {
        const result = stringCompare("A", "b");
        expect(result)
            .toBe(-1);
    });
});
