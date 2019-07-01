import { safeParseJson } from "./safeParseJson";

describe("safeParseJson", () => {
    it("should return valid json", () => {
        const json = safeParseJson("{ \"foo\": \"bar\" }");
        expect(json)
            .toEqual({
                foo: "bar"
            });
    });
    it("should not throw error on undefined json string", () => {
        const json = safeParseJson(undefined);
        expect(json)
            .toEqual({});
    });
    it("should not throw error on empty json string", () => {
        const json = safeParseJson("");
        expect(json)
            .toEqual({});
    });
    it("should not throw error on invalid json string", () => {
        const json = safeParseJson("{ invalid json ");
        expect(json)
            .toEqual({});
    });
});
