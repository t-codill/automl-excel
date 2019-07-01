import { isSameError } from "./isSameError";

describe("isSameError", () => {
    it("should return false when code are different", () => {
        expect(isSameError({
            name: "",
            message: "",
            statusCode: 1
        },
            {
                name: "",
                message: "",
                statusCode: 2
            }))
            .toBe(false);
    });
    it("should return false message are different", () => {
        expect(isSameError({
            name: "",
            message: "msg1",
            statusCode: 1
        },
            {
                name: "",
                message: "msg2",
                statusCode: 1
            }))
            .toBe(false);
    });
    it("should return true when both has no message", () => {
        expect(isSameError({
            name: "",
            message: "",
            statusCode: 1
        },
            {
                name: "",
                message: "",
                statusCode: 1
            }))
            .toBe(true);
    });
    it("should return false when one has no message", () => {
        expect(isSameError({
            name: "",
            message: "msg1",
            statusCode: 1
        },
            {
                name: "",
                message: "",
                statusCode: 1
            }))
            .toBe(false);
    });
    it("should return when first line are same", () => {
        expect(isSameError({
            name: "",
            message: "msg\rmsg1",
            statusCode: 1
        },
            {
                name: "",
                message: "msg\nmsg2",
                statusCode: 1
            }))
            .toBe(true);
    });
});
