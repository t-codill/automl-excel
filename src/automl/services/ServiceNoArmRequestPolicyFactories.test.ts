import { RequestPolicyOptions } from "@azure/ms-rest-js";
import { testContext } from "../common/context/__data__/testContext";
import { ServiceNoArmRequestPolicyFactories } from "./ServiceNoArmRequestPolicyFactories";

describe("ServiceNoArmRequestPolicyFactories", () => {
    it("should init", async () => {
        const factories = ServiceNoArmRequestPolicyFactories(testContext.logger)([]);
        expect(factories)
            .toMatchSnapshot();
    });
    it("should sendRequest", async () => {
        const factories = ServiceNoArmRequestPolicyFactories(testContext.logger)([]);
        const policy = factories[0].create({ sendRequest: jest.fn() }, new RequestPolicyOptions());
        expect(policy)
            .toMatchSnapshot();
    });
});
