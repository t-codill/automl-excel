import { AzureMachineLearningDatastoreManagementModels } from "@vienna/datastore";
import { NotNullableProperties } from "../../common/utils/NotNullableProperties";

export const sampleDataStore: NotNullableProperties<AzureMachineLearningDatastoreManagementModels.DataStoreDto> = {
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
