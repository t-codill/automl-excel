import { getResourceGroupName } from "./getResourceGroupName";

describe("getResourceGroupName", () => {
    it("should return undefined if id is undefined", () => {
        expect(getResourceGroupName(undefined))
            .toBeUndefined();
    });
    it("should return undefined if id is invalid format", () => {
        expect(getResourceGroupName("invalid format"))
            .toBeUndefined();
    });
    it("should return undefined if resource group is invalid", () => {
        const id = "https://eastus2euap.experiments.azureml.net/history/v1.0/" +
            "subscriptions/381b38e9-9840-4719-a5a0-61d9585e1e91/resourceGroups/fq&EAUUb9yJq.>-R/" +
            "providers/Microsoft.MachineLearningServices/workspaces/test_ws/" +
            "experiments/automl-local-regression/runs";
        const rg = getResourceGroupName(id);
        expect(rg)
            .toBeUndefined();
    });

    it("should return valid resource group", () => {
        const id = "https://eastus2euap.experiments.azureml.net/history/v1.0/" +
            "subscriptions/381b38e9-9840-4719-a5a0-61d9585e1e91/resourceGroups/test_rg/" +
            "providers/Microsoft.MachineLearningServices/workspaces/test_ws/" +
            "experiments/automl-local-regression/runs";
        const rg = getResourceGroupName(id);
        expect(rg)
            .toBe("test_rg");
    });
});
