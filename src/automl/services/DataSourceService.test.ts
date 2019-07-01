import { sampleStorageAccount } from "../../__data__/sampleStorageAccount";
import { sampleStorageContainer } from "../../__data__/sampleStorageContainer";
import { testContext } from "../common/context/__data__/testContext";
import { DataSourceService } from "./DataSourceService";

jest.mock("@azure/storage-blob");

const service = new DataSourceService(testContext, {
    account: sampleStorageAccount,
    container: sampleStorageContainer,
    sasToken: "sampleSasToken"
});

describe("DataSourceService", () => {
    it("should listBlob", async () => {
        const result = await service.listBlob();
        expect(result)
            .toMatchSnapshot();
    });
});
