import { nameof } from "./nameof";

interface ITestInterface {
    Test: string;
}

describe("nameof", () => {
    it("should return property name", () => {
        expect(nameof<ITestInterface>("Test"))
            .toBe("Test");
    });
});
