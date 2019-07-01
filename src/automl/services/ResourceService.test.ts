import { testContext } from "../common/context/__data__/testContext";
import { ResourceService } from "./ResourceService";

jest.mock("@azure/arm-resources");

const service = new ResourceService(testContext);

describe("ResourceService", () => {
    it("should createResourcesGroup", async () => {
        const result = await service.createResourcesGroup("sampleResourceGroup", "eastus");
        expect(result)
            .toMatchSnapshot();
    });
    it("should createWorkspace", async () => {
        const result = await service.createWorkspace("sampleWorkSpace", "sampleResourceGroup", "eastus");
        expect(result)
            .toMatchSnapshot();
    });
});
