import * as dateCompareModel from "./dateCompare";
import * as defaultCompareModel from "./defaultCompare";
import * as emptyCompareModel from "./emptyCompare";
import { compare } from "./index";
import * as numberCompareModel from "./numberCompare";
import * as stringCompareModel from "./stringCompare";

describe("compare", () => {
    it("should compare empty", () => {
        const spy = jest.spyOn(emptyCompareModel, "emptyCompare");
        const a = undefined;
        const b = null;
        compare(a, b);
        expect(spy)
            .toBeCalledWith(a, b);
    });
    it("should compare date", () => {
        const spy = jest.spyOn(dateCompareModel, "dateCompare");
        const a = new Date(1);
        const b = new Date(2);
        compare(a, b);
        expect(spy)
            .toBeCalledWith(a, b);
    });
    it("should compare number", () => {
        const spy = jest.spyOn(numberCompareModel, "numberCompare");
        const a = 1;
        const b = 2;
        compare(a, b);
        expect(spy)
            .toBeCalledWith(a, b, undefined);
    });
    it("should compare number with nanAsMax", () => {
        const spy = jest.spyOn(numberCompareModel, "numberCompare");
        const a = 1;
        const b = 2;
        compare(a, b, { nanAsMax: true });
        expect(spy)
            .toBeCalledWith(a, b, true);
    });
    it("should compare string", () => {
        const spy = jest.spyOn(stringCompareModel, "stringCompare");
        const a = "1";
        const b = "2";
        compare(a, b);
        expect(spy)
            .toBeCalledWith(a, b, undefined);
    });
    it("should compare string with ignore case", () => {
        const spy = jest.spyOn(stringCompareModel, "stringCompare");
        const a = "1";
        const b = "2";
        compare(a, b, { ignoreCase: true });
        expect(spy)
            .toBeCalledWith(a, b, true);
    });
    it("should compare others", () => {
        const spy = jest.spyOn(defaultCompareModel, "defaultCompare");
        const a = 1;
        const b = "2";
        compare(a, b);
        expect(spy)
            .toBeCalledWith(a, b);
    });
});
