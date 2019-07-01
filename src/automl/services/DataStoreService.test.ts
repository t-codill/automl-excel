import { AzureMachineLearningDatastoreManagementClient } from "@vienna/datastore";
import { restCanceledError } from "../../__data__/restCanceledError";
import { restNotFoundError } from "../../__data__/restNotFoundError";
import { sampleStorageAccount } from "../../__data__/sampleStorageAccount";
import { sampleStorageContainer } from "../../__data__/sampleStorageContainer";
import { testContext } from "../common/context/__data__/testContext";
import { DataStoreService } from "./DataStoreService";

jest.mock("@vienna/datastore");
const service = new DataStoreService(testContext);

describe("DataStoreService", () => {
    it("should list", async () => {
        const result = await service.list();
        expect(result)
            .toMatchSnapshot();
    });

    it("should not add if exist canceled", async () => {
        const spy = jest.spyOn(AzureMachineLearningDatastoreManagementClient.prototype.dataStore, "get");
        spy.mockImplementation(() => { throw restCanceledError; });
        const result = await service.add(sampleStorageContainer, sampleStorageAccount, "sampleSasToken");
        expect(result)
            .toBeUndefined();
    });

    it("should not add if missing container name", async () => {
        const result = await service.add({ ...sampleStorageContainer, name: undefined }, sampleStorageAccount, "sampleSasToken");
        expect(result)
            .toBeUndefined();
    });

    it("should not add if missing account name", async () => {
        const result = await service.add(sampleStorageContainer, { ...sampleStorageAccount, name: undefined }, "sampleSasToken");
        expect(result)
            .toBeUndefined();
    });

    it("should not add if missing account primaryEndpoints", async () => {
        const result = await service.add(sampleStorageContainer, { ...sampleStorageAccount, primaryEndpoints: undefined }, "sampleSasToken");
        expect(result)
            .toBeUndefined();
    });

    it("should not add if missing account blob primaryEndpoints", async () => {
        const result = await service.add(sampleStorageContainer, { ...sampleStorageAccount, primaryEndpoints: {} }, "sampleSasToken");
        expect(result)
            .toBeUndefined();
    });

    it("should not add if missing sas token", async () => {
        const result = await service.add(sampleStorageContainer, sampleStorageAccount, "");
        expect(result)
            .toBeUndefined();
    });

    it("should add if data store does not exist", async () => {
        const getSpy = jest.spyOn(AzureMachineLearningDatastoreManagementClient.prototype.dataStore, "get");
        getSpy.mockImplementation(() => { throw restNotFoundError; });
        const createSpy = jest.spyOn(AzureMachineLearningDatastoreManagementClient.prototype.dataStore, "create");
        const result = await service.add(sampleStorageContainer, sampleStorageAccount, "sampleSasToken");
        expect(createSpy)
            .toBeCalledTimes(1);
        expect(result)
            .toBe("sampleStorageAccount__sampleContainer");
    });

    it("should update if data store exist", async () => {
        const updateSpy = jest.spyOn(AzureMachineLearningDatastoreManagementClient.prototype.dataStore, "update");
        const result = await service.add(sampleStorageContainer, sampleStorageAccount, "sampleSasToken");
        expect(updateSpy)
            .toBeCalledTimes(1);
        expect(result)
            .toBe("sampleStorageAccount__sampleContainer");
    });
    it("should get default if default store exist", async () => {
        const getDefaultSpy = jest.spyOn(AzureMachineLearningDatastoreManagementClient.prototype.dataStore, "getDefault");
        const result = await service.getDefault();
        expect(getDefaultSpy)
            .toBeCalledTimes(1);
        expect(result)
            .toMatchSnapshot();
    });
});
