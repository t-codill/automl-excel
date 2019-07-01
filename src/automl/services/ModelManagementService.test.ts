import { testContext } from "../common/context/__data__/testContext";
import { ModelManagementService } from "./ModelManagementService";

jest.mock("@vienna/model-management");

const service = new ModelManagementService(testContext);

describe("ModelManagementService", () => {
    it("should registerModel", async () => {
        const result = await service.registerModel("test", "test description", "test url", "test mime type", "experimentName", "runId");
        expect(result)
            .toMatchSnapshot();
    });
    it("should createAsset", async () => {
        const result = await service.createAsset("test", "test description", "http://www.dummyurl.com/dummy");
        expect(result)
            .toMatchSnapshot();
    });
});
