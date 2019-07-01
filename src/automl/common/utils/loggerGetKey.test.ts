import { Region } from "./getRegion";
import { loggerGetKey } from "./loggerGetKey";

describe("loggerGetKey", () => {
    it("invalid region should not get key", () => {
        expect(loggerGetKey("invalid region" as Region))
            .toBeUndefined();
    });

    it("dev env should get key", () => {
        expect(loggerGetKey("development"))
            .toBe("09ab9f4a-c812-418a-8ef7-36c860aa003e");
    });

    it("east us should get key", () => {
        expect(loggerGetKey("eastus"))
            .toBe("37bee233-bf42-415c-aaf3-2e3385a31175");
    });
});
