import { StorageManagementModels } from "@azure/arm-storage";

export const sampleStorageAccount: StorageManagementModels.StorageAccount = {
    location: "eastus",
    id: "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sampleResourceGroup/Microsoft.Storage/storageAccounts/sampleStorageAccounts",
    name: "sampleStorageAccount",
    primaryEndpoints: {
        blob: "https://blob.samplestorageaccount.com"
    }
};
