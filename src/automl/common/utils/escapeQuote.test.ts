import { escapeQuote } from "./escapeQuote";

describe("escapeQuote", () => {
    it("should escape quotes", () => {
        const quotedText = JSON.stringify({ hello: "there\" you are\"!\"" });
        const escapedText = escapeQuote(quotedText);
        expect(escapedText)
            .toBe("{\\\"hello\\\":\\\"there\\\\\\\" you are\\\\\\\"!\\\\\\\"\\\"}");
    });
});
