import * as getEnvModule from "./getEnv";
import { getRegion } from "./getRegion";

describe("getRegion", () => {

    let getEnvSpy: jest.SpyInstance;
    beforeEach(() => {
        getEnvSpy = jest.spyOn(getEnvModule, "getEnv");
    });
    it("should return env placeholder if env is production", () => {
        getEnvSpy.mockReturnValueOnce("production");
        expect(getRegion())
            .toBe("##VIENNA_ENVIRONMENT##");
    });
    it("should return development if env is development", () => {
        getEnvSpy.mockReturnValueOnce("development");
        expect(getRegion())
            .toBe("development");
    });
    it("should return test if env is test", () => {
        getEnvSpy.mockReturnValueOnce("test");
        expect(getRegion())
            .toBe("test");
    });
});
