import { testContext } from "../common/context/__data__/testContext";
import { DataPrepService } from "./DataPrepService";

jest.mock("@vienna/dataprep");

const service: DataPrepService = new DataPrepService(testContext);

describe("DataPrepService", () => {
    it("should start", async () => {
        const result = await service.startDataProfiling("dataStoreName",
            "blobName",
            "experimentName",
            "computeTargetName",
            10000);
        expect(result)
            .toMatchSnapshot();
    });
});
