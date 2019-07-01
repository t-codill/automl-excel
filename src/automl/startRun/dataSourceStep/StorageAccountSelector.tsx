import { StorageManagementModels } from "@azure/arm-storage";
import { Label } from "office-ui-fabric-react";
import * as React from "react";
import { IDataLoadState } from "../../common/IDataLoadState";
import { BaseComponent } from "../../components/Base/BaseComponent";
import { DataTable } from "../../components/DataTable/DataTable";
import { StorageService } from "../../services/StorageService";

export interface IStorageAccountSelectorProps {
    account: StorageManagementModels.StorageAccount | undefined;
    defaultStorageAccountName?: string;
    autoSelect?: boolean;
    onAccountSelected(
        account: StorageManagementModels.StorageAccount | undefined,
        sasToken: string | undefined
    ): void;
}

export interface IStorageAccountSelectorState extends IDataLoadState {
    accounts: StorageManagementModels.StorageAccount[] | undefined;
}

export class StorageAccountSelector
    extends BaseComponent<IStorageAccountSelectorProps, IStorageAccountSelectorState, { storageService: StorageService }> {
    protected readonly serviceConstructors = { storageService: StorageService };

    constructor(props: IStorageAccountSelectorProps) {
        super(props);

        this.state = {
            isDataLoaded: false,
            accounts: undefined
        };
    }

    public render(): React.ReactNode {
        return <div className="data-source-grid-container">
            <Label>Select an Azure blob storage account for your data</Label>
            <DataTable
                enableShimmer={!this.state.isDataLoaded}
                selectCallback={this.selectAccount}
                items={this.state.accounts || []}
                itemsPerPage={10}
                sortColumnFieldName="name"
                columns={[
                    {
                        field: "name"
                    },
                    {
                        field: "kind"
                    },
                ]}
            />
        </div>;
    }

    protected readonly getData = async () => {
        this.setState({ isDataLoaded: false });
        const accounts = await this.services.storageService.listAccount();
        if (!accounts) {
            return;
        }
        this.setState({ accounts, isDataLoaded: true });
        if (this.props.autoSelect && this.props.defaultStorageAccountName) {
            const defaultAccount = accounts.find((account) => account.name === this.props.defaultStorageAccountName);
            this.selectAccount(defaultAccount);
        }
    }

    private readonly selectAccount = async (account?: StorageManagementModels.StorageAccount) => {
        if (!account) {
            return;
        }

        const sasToken = await this.services.storageService.getSasToken(account);
        if (sasToken && sasToken.accountSasToken) {
            this.props.onAccountSelected(account, sasToken.accountSasToken);
        }
    }
}
