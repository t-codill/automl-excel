import { Models } from "@azure/storage-blob";

export const sampleStorageBlob: Models.BlobItem = {
    name: "sampleBlob",
    deleted: false,
    snapshot: "sampleSnapShot",
    properties: {
        lastModified: new Date("2019-01-01T00:00:00.000Z"),
        etag: "sampleEtag",
        contentLength: 1000
    }
};

export const sampleCsvBlob: Models.BlobItem = {
    name: "sampleCsv.csv",
    deleted: false,
    snapshot: "sampleSnapShot",
    properties: {
        lastModified: new Date("2019-01-01T00:00:00.000Z"),
        etag: "sampleEtag",
        contentLength: 1000
    }
};
