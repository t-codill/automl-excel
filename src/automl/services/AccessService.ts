import { AuthorizationManagementClient, AuthorizationManagementModels } from "@azure/arm-authorization";
import { includes, map, some } from "lodash";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseArm } from "./ServiceBaseArm";

function hasPermission(permissionActions: Array<string[] | undefined>): boolean {
    return some(permissionActions, (permissionAction) => includes(permissionAction, "*"));
}

export class AccessService extends ServiceBaseArm<AuthorizationManagementClient> {
    constructor(props: IServiceBaseProps) {
        super(props, AuthorizationManagementClient);
    }

    public async getAccess(): Promise<AuthorizationManagementModels.PermissionGetResult | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.permissions.listForResource(
                this.props.resourceGroupName,
                "Microsoft.MachineLearningServices",
                "",
                "workspaces",
                this.props.workspaceName, {
                    abortSignal
                });
        });
    }
    public readonly checkPermission = async () => {
        const curPermissions = await this.getAccess();
        if (!curPermissions) {
            return undefined;
        }
        const permissionActions = map(curPermissions, (permission) => permission && permission.actions);
        return hasPermission(permissionActions);
    }
}
