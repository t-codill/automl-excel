export function getResourceGroupName(id: string | undefined): string | undefined {
    if (!id) {
        return undefined;
    }
    const resourceGroups = /\/subscriptions\/[0-9A-F-]{36}\/resourceGroups\/([\w_\-.()]+)\//gi.exec(id);
    if (!resourceGroups) {
        return undefined;
    }
    return resourceGroups[1];
}
