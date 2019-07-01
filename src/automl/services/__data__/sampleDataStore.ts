import { AzureMachineLearningDatastoreManagementModels } from "@vienna/datastore";

export const sampleDataStore: Required<AzureMachineLearningDatastoreManagementModels.DataStoreDto> = {
    dataStoreType: "AzureBlob",
    name: "defaultDataStore",
    azureStorageSection: {
        accountKey: "key",
        accountName: "account",
        credentialType: "AccountKey",
        credential: "secret",
        containerName: "defaultContainer",
        isSas: false
    },
    azureDataLakeSection: {},
    azurePostgreSqlSection: {},
    azureSqlDatabaseSection: {},
    hasBeenValidated: true
};
