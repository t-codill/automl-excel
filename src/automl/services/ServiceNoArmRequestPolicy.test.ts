import { RequestPolicyOptions, WebResource } from "@azure/ms-rest-js";
import { testContext } from "../common/context/__data__/testContext";
import { ServiceNoArmRequestPolicy } from "./ServiceNoArmRequestPolicy";

const sendRequest = jest.fn();
const nextPolicy = {
    sendRequest
};
let service: ServiceNoArmRequestPolicy;

describe("ServiceNoArmRequestPolicy", () => {
    it("should init", async () => {
        service = new ServiceNoArmRequestPolicy(nextPolicy, new RequestPolicyOptions(), testContext.logger);
    });
    it("should set user type", async () => {
        service.sendRequest(new WebResource());
        const request: WebResource = sendRequest.mock.calls[0][0];
        expect(request.headers.get("x-ms-client-user-type"))
            .toBe("AutoML WebUser");
    });
    it("should set request id", async () => {
        service.sendRequest(new WebResource());
        const request: WebResource = sendRequest.mock.calls[0][0];
        expect(request.headers.get("x-ms-client-request-id"))
            .toBe("##Guid##");
    });
    it("should set session Id", async () => {
        service.sendRequest(new WebResource());
        const request: WebResource = sendRequest.mock.calls[0][0];
        expect(request.headers.get("x-ms-client-session-id"))
            .toBe("sessionId");
    });
});
