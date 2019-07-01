import { StorageManagementModels } from "@azure/arm-storage";
import { AbortSignalLike } from "@azure/ms-rest-js";
import { Aborter, AnonymousCredential, Models, Pipeline, StorageURL } from "@azure/storage-blob";
import { IServiceClient } from "./IServiceClient";
import { IServiceBaseProps, ServiceBase } from "./ServiceBase";

export interface IServiceBaseBlobProps {
    account: StorageManagementModels.StorageAccount;
    container: StorageManagementModels.BlobContainer;
    sasToken: string;
}
export abstract class ServiceBaseBlob<TClient extends StorageURL> extends ServiceBase<TClient & IServiceClient> {
    constructor(props: IServiceBaseProps, blobProps: IServiceBaseBlobProps, clientInitializer: new (url: string, pipeline: Pipeline) => TClient, blob?: Models.BlobItem) {
        const baseUrl = blobProps.account.primaryEndpoints && blobProps.account.primaryEndpoints.blob;
        const url = `${baseUrl}${blobProps.container.name}${blob ? `/${blob.name}` : ""}?${blobProps.sasToken}`;
        super(props, new clientInitializer(url, StorageURL.newPipeline(new AnonymousCredential(), {
            retryOptions: undefined
        })));
        if (!baseUrl) {
            props.onError(new Error("Cannot read blob, blob is not supported for this storage account"));
            this.dispose();
        }
    }

    protected getAborter(abortSignal: AbortSignalLike): Aborter {
        const aborter = Aborter.none;
        abortSignal.addEventListener("abort", () => {
            aborter.abort();
        });
        return aborter;
    }
}
