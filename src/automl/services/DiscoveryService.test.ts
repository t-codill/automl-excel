import { testContext } from "../common/context/__data__/testContext";
import { DiscoveryService } from "./DiscoveryService";

jest.mock("@vienna/discovery");

const service = new DiscoveryService(testContext, "https://sample.com");

describe("DiscoveryService", () => {
    it("should get", async () => {
        const result = await service.get();
        expect(result)
            .toMatchSnapshot();
    });
});
