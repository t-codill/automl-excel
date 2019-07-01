import { getEnv } from "./getEnv";

describe("getEnv", () => {
    const oldNodeEnv = process.env.NODE_ENV;
    it("should return expected value from process", () => {
        (process.env as unknown as { NODE_ENV: string }).NODE_ENV = "production";

        expect(getEnv())
            .toBe("production");
    });

    afterEach(() => {
        (process.env as unknown as { NODE_ENV: string }).NODE_ENV = oldNodeEnv;
    });
});
