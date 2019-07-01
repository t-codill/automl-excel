import { sampleStorageAccount } from "../../__data__/sampleStorageAccount";
import { testContext } from "../common/context/__data__/testContext";
import { StorageService } from "./StorageService";

jest.mock("@azure/arm-storage");

const service = new StorageService(testContext);

describe("StorageService", () => {
    it("should getAccount", async () => {
        const result = await service.getAccount("testResourceGroup", "testAccount");
        expect(result)
            .toMatchSnapshot();
    });

    it("should listAccount", async () => {
        const result = await service.listAccount();
        expect(result)
            .toMatchSnapshot();
    });

    it("should getContainer", async () => {
        const result = await service.getContainer("sampleResourceGroup", "sampleAccount", "sampleContainer");
        expect(result)
            .toMatchSnapshot();
    });

    describe("getSasToken", () => {
        it("should not without account name", async () => {
            const result = await service.getSasToken({ ...sampleStorageAccount, name: undefined });
            expect(result)
                .toBeUndefined();
        });

        it("should not without resource group", async () => {
            const result = await service.getSasToken({ ...sampleStorageAccount, id: "invalidId" });
            expect(result)
                .toBeUndefined();
        });

        it("should", async () => {
            const result = await service.getSasToken({ ...sampleStorageAccount });
            expect(result)
                .toMatchSnapshot();
        });
    });

    describe("listContainer", () => {
        it("should not without account name", async () => {
            const result = await service.listContainer({ ...sampleStorageAccount, name: undefined });
            expect(result)
                .toBeUndefined();
        });

        it("should not without resource group", async () => {
            const result = await service.listContainer({ ...sampleStorageAccount, id: "invalidId" });
            expect(result)
                .toBeUndefined();
        });

        it("should", async () => {
            const result = await service.listContainer(sampleStorageAccount);
            expect(result)
                .toMatchSnapshot();
        });
    });
});
