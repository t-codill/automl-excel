import { BaseRequestPolicy, HttpOperationResponse, RequestPolicy, RequestPolicyOptions, WebResource } from "@azure/ms-rest-js";
import { v4 as uuid4 } from "uuid";
import { ILogger } from "../common/utils/ILogger";

export class ServiceNoArmRequestPolicy extends BaseRequestPolicy {
    private readonly logger: ILogger;
    constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, logger: ILogger) {
        super(nextPolicy, options);
        this.logger = logger;
    }
    public async sendRequest(webResource: WebResource): Promise<HttpOperationResponse> {
        webResource.headers.set("x-ms-client-user-type", "AutoML WebUser");
        webResource.headers.set("x-ms-client-request-id", uuid4());
        webResource.headers.set("x-ms-client-session-id", this.logger.getSessionId());
        const response = await this._nextPolicy.sendRequest(webResource);
        return response;
    }

}
