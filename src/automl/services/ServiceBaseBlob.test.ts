import { sampleStorageAccount } from "../../__data__/sampleStorageAccount";
import { sampleStorageBlob } from "../../__data__/sampleStorageBlob";
import { sampleStorageContainer } from "../../__data__/sampleStorageContainer";
import { testContext } from "../common/context/__data__/testContext";
import { WorkspaceError } from "../common/context/IWorkspaceProps";
import { BlockBlobService } from "./BlockBlobService";

describe("ServiceBaseBlob", () => {
    it("should error without primary endpoints", async () => {
        let error: WorkspaceError | undefined;
        const service: BlockBlobService = new BlockBlobService({ ...testContext, onError: (err) => { error = err; } }, {
            account: { ...sampleStorageAccount, primaryEndpoints: undefined },
            blob: sampleStorageBlob,
            container: sampleStorageContainer,
            sasToken: "sampleSasToken"
        });
        service.reset();
        expect(error)
            .toMatchSnapshot();
    });
    it("should error without blob endpoints", async () => {
        let error: WorkspaceError | undefined;
        const service: BlockBlobService = new BlockBlobService({ ...testContext, onError: (err) => { error = err; } }, {
            account: { ...sampleStorageAccount, primaryEndpoints: {} },
            blob: sampleStorageBlob,
            container: sampleStorageContainer,
            sasToken: "sampleSasToken"
        });
        service.reset();
        expect(error)
            .toMatchSnapshot();
    });
});
