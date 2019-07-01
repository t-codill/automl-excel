import { blob2string } from "./blob2string";

describe("blob2string", () => {
    it("should return the right string", async () => {
        expect(await blob2string(new Blob(["test"])))
            .toBe("test");
    });
});
