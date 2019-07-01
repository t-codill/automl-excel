import { Validators } from "./Validators";

describe("Validators", () => {
    const errorMsg = "error message";
    const lengthFunc = (length: number) => `error: length is ${length}`;
    describe("Required", () => {
        it("should pass", () => {
            expect(Validators.required(errorMsg)("valid input"))
                .toBeUndefined();
        });
        it("should error for undefined", () => {
            expect(Validators.required(errorMsg)(undefined))
                .toBe(errorMsg);
        });
        it("should error for empty", () => {
            expect(Validators.required(errorMsg)(""))
                .toBe(errorMsg);
        });
        it("should error for 0 length array", () => {
            expect(Validators.required(errorMsg)([]))
                .toBe(errorMsg);
        });
    });
    describe("length", () => {
        it("should pass", () => {
            expect(Validators.length(11, lengthFunc)("valid input"))
                .toBeUndefined();
        });
        it("should pass for undefined with length 0", () => {
            expect(Validators.length(0, lengthFunc)(undefined))
                .toBeUndefined();
        });
        it("should error for invalid length", () => {
            expect(Validators.length(1, lengthFunc)("valid input"))
                .toBe(lengthFunc(11));
        });
    });
    describe("minLength", () => {
        it("should pass", () => {
            expect(Validators.minLength(11, lengthFunc)("valid input"))
                .toBeUndefined();
        });
        it("should pass for undefined with length 0", () => {
            expect(Validators.minLength(0, lengthFunc)(undefined))
                .toBeUndefined();
        });
        it("should error for invalid minLength", () => {
            expect(Validators.minLength(13, lengthFunc)("valid input"))
                .toBe(lengthFunc(11));
        });
    });
    describe("maxLength", () => {
        it("should pass", () => {
            expect(Validators.maxLength(11, lengthFunc)("valid input"))
                .toBeUndefined();
        });
        it("should pass for undefined", () => {
            expect(Validators.maxLength(20, lengthFunc)(undefined))
                .toBeUndefined();
        });
        it("should error for invalid maxLength", () => {
            expect(Validators.maxLength(10, lengthFunc)("valid input"))
                .toBe(lengthFunc(11));
        });
    });
    describe("regex", () => {
        it("should pass", () => {
            expect(Validators.regex(/valid/, errorMsg)("valid input"))
                .toBeUndefined();
        });
        it("should not pass for undefined", () => {
            expect(Validators.regex(/invalid/, errorMsg)(undefined))
                .toBe(errorMsg);
        });
        it("should error for invalid value", () => {
            expect(Validators.regex(/invalid/, errorMsg)("valid input"))
                .toBe(errorMsg);
        });
    });
    describe("minValue", () => {
        it("should pass", () => {
            expect(Validators.minValue(11, lengthFunc)("12"))
                .toBeUndefined();
        });
        it("should pass for undefined", () => {
            expect(Validators.minValue(12, lengthFunc)(undefined))
                .toBeUndefined();
        });
        it("should error for invalid minValue", () => {
            expect(Validators.minValue(13, lengthFunc)("11"))
                .toBe(lengthFunc(11));
        });
        it("should pass if not a number", () => {
            expect(Validators.minValue(13, lengthFunc)("11ff"))
                .toBeUndefined();
        });
    });
    describe("maxValue", () => {
        it("should pass", () => {
            expect(Validators.maxValue(11, lengthFunc)("10"))
                .toBeUndefined();
        });
        it("should pass for undefined", () => {
            expect(Validators.maxValue(20, lengthFunc)(undefined))
                .toBeUndefined();
        });
        it("should error for invalid maxValue", () => {
            expect(Validators.maxValue(10, lengthFunc)("12"))
                .toBe(lengthFunc(12));
        });
        it("should pass if not a number", () => {
            expect(Validators.maxValue(13, lengthFunc)("11ff"))
                .toBeUndefined();
        });
    });
    describe("isNumber", () => {
        it("should pass", () => {
            expect(Validators.isNumber(errorMsg)("10.345"))
                .toBeUndefined();
        });
        it("should pass for undefined", () => {
            expect(Validators.isNumber(errorMsg)(undefined))
                .toBeUndefined();
        });
        it("should error for invalid number", () => {
            expect(Validators.isNumber(errorMsg)("11ff"))
                .toBe(errorMsg);
        });
    });
    describe("isInteger", () => {
        it("should pass", () => {
            expect(Validators.isInteger(errorMsg)("10"))
                .toBeUndefined();
        });
        it("should pass for undefined", () => {
            expect(Validators.isInteger(errorMsg)(undefined))
                .toBeUndefined();
        });
        it("should error for invalid number", () => {
            expect(Validators.isInteger(errorMsg)("11ff"))
                .toBe(errorMsg);
        });
        it("should error for decimals", () => {
            expect(Validators.isInteger(errorMsg)("11.23"))
                .toBe(errorMsg);
        });
    });
});
