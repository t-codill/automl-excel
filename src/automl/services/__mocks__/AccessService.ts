import { AuthorizationManagementModels } from "@azure/arm-authorization";

export class AccessService {

    public async getAccess(): Promise<AuthorizationManagementModels.PermissionGetResult | undefined> {
        return [{
            actions: ["*"]
        }];
    }

    public async checkPermission(): Promise<boolean | undefined> {
        return true;
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
