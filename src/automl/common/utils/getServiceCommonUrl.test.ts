import { getServiceCommonUrl } from "./getServiceCommonUrl";

describe("getServiceCommonUrl", () => {
    it("should return undefined if subscriptionId is undefined", () => {
        expect(getServiceCommonUrl(undefined, "b", "c"))
            .toBeUndefined();
    });
    it("should return undefined if resourceGroupName is undefined", () => {
        expect(getServiceCommonUrl("a", undefined, "c"))
            .toBeUndefined();
    });
    it("should return undefined if resourceGroupName is undefined", () => {
        expect(getServiceCommonUrl("a", "b", undefined))
            .toBeUndefined();
    });
    it("should return valid url", () => {
        expect(getServiceCommonUrl("a", "b", "c"))
            .toBe("/subscriptions/a/resourceGroups/b/providers/Microsoft.MachineLearningServices/workspaces/c");
    });
});
