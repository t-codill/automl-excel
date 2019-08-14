export function getServiceCommonUrl(subscriptionId: string | undefined, resourceGroupName: string | undefined, workspaceName: string | undefined): string | undefined {
    if (!subscriptionId || !resourceGroupName || !workspaceName) {
        return undefined;
    }
    return `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.MachineLearningServices/workspaces/${workspaceName}`;
}
