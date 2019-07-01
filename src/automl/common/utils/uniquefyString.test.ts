import { performance } from "perf_hooks";
import { uniquefyString } from "./uniquefyString";

describe("uniquefyString", () => {
    it("should not add suffix for unique strings", () => {
        const res = uniquefyString(["a", "b", "c"]);
        expect(res)
            .toEqual(["a", "b", "c"]);
    });

    it("should trim", () => {
        const res = uniquefyString([" a", "b ", " c "]);
        expect(res)
            .toEqual(["a", "b", "c"]);
    });

    it("should add suffix", () => {
        const res = uniquefyString(["a", "a", "a"]);
        expect(res)
            .toEqual(["a", "a_1", "a_2"]);
    });

    it("should use min suffix", () => {
        const res = uniquefyString(["col_2", "col", "col", "col"]);
        expect(res)
            .toEqual(["col_2", "col", "col_1", "col_3"]);
    });

    it("should add suffix when suffix exists", () => {
        const res = uniquefyString(["col_2", "col_2", "col", "col"]);
        expect(res)
            .toEqual(["col_2", "col_2_1", "col", "col_1"]);
    });

    it("should add suffix when suffix exists 2", () => {
        const res = uniquefyString(["col_1", "col_1", "col", "col"]);
        expect(res)
            .toEqual(["col_1", "col_1_1", "col", "col_2"]);
    });
    it("performance with large array", async () => {
        const start = performance.now();
        const length = 99999;
        const test = Array(length)
            .fill("col");
        uniquefyString(test);
        expect(performance.now() - start)
            .toBeLessThan(3000);
    }); // jest timeout does not work for sync functions
});
