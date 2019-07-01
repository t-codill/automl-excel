import { dateCompare } from "./dateCompare";

describe("date compare", () => {
    it("should return -1 for 2018-1-1 < 2019-1-1", () => {
        const result = dateCompare(new Date("2018-1-1"), new Date("2019-1-1"));
        expect(result)
            .toBe(-1);
    });
    it("should return 1 for 2028-1-1 > 2019-1-1", () => {
        const result = dateCompare(new Date("2028-1-1"), new Date("2019-1-1"));
        expect(result)
            .toBe(1);
    });
    it("should return 0 for a == b", () => {
        const result = dateCompare(new Date("2018-1-1"), new Date("2018-1-1"));
        expect(result)
            .toBe(0);
    });
    it("different date format should not impact compare result", () => {
        let result = dateCompare(new Date("2018-1-1"), new Date("2018/1/1"));
        expect(result)
            .toBe(0);
        result = dateCompare(new Date("2018-1-1 15:33:45"), new Date("2018/1/1 3:33:45 PM"));
        expect(result)
            .toBe(0);
        result = dateCompare(new Date("2018 Jan 1 15:33:45"), new Date("2018/1/1 3:33:45 PM"));
        expect(result)
            .toBe(0);
        result = dateCompare(new Date("Jan 1 2018 15:33:45"), new Date("2018/1/1 3:33:45 PM"));
        expect(result)
            .toBe(0);
        result = dateCompare(new Date("1/1/2018 15:33:45"), new Date("2018/1/1 3:33:45 PM"));
        expect(result)
            .toBe(0);
        result = dateCompare(new Date("2015-03-25T12:00:00-0800"), new Date("2015/3/25 1:00:00 PM GMT-7"));
        expect(result)
            .toBe(0);
    });
    it("should return -1 for a is invalid", () => {
        const result = dateCompare(new Date("2018-31-1"), new Date("2019-1-1"));
        expect(result)
            .toBe(-1);
    });
    it("should return 1 for b is invalid", () => {
        const result = dateCompare(new Date("2018-1-1"), new Date("2019-1-52"));
        expect(result)
            .toBe(1);
    });
    it("should return 0 for both a and b are invalid", () => {
        const result = dateCompare(new Date("2018-231-1"), new Date("2019-1-87"));
        expect(result)
            .toBe(0);
    });
});
