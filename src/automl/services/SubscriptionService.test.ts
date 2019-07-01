import { testContext } from "../common/context/__data__/testContext";
import { SubscriptionService } from "./SubscriptionService";

jest.mock("@azure/arm-subscriptions");

const service = new SubscriptionService(testContext);

describe("SubscriptionService", () => {
    it("should listSubscriptions", async () => {
        const result = await service.listSubscriptions();
        expect(result)
            .toMatchSnapshot();
    });
});
