import { StorageManagementModels } from "@azure/arm-storage";
import { Label } from "office-ui-fabric-react";
import * as React from "react";
import { IDataLoadState } from "../../common/IDataLoadState";
import { BaseComponent } from "../../components/Base/BaseComponent";
import { DataTable } from "../../components/DataTable/DataTable";
import { StorageService } from "../../services/StorageService";

export interface IStorageContainerSelectorProps {
    account: StorageManagementModels.StorageAccount;
    container: StorageManagementModels.ListContainerItem | undefined;
    defaultContainerName?: string;
    autoSelect: boolean;
    onContainerSelected(container: StorageManagementModels.ListContainerItem): void;
}

export interface IStorageContainerSelectorState extends IDataLoadState {
    containers: StorageManagementModels.ListContainerItem[] | undefined;
}

export class StorageContainerSelector
    extends BaseComponent<IStorageContainerSelectorProps, IStorageContainerSelectorState, { storageService: StorageService }> {
    protected readonly serviceConstructors = { storageService: StorageService };

    constructor(props: IStorageContainerSelectorProps) {
        super(props);

        this.state = {
            isDataLoaded: false,
            containers: undefined
        };
    }
    public componentDidUpdate(prevProps: IStorageContainerSelectorProps): void {
        if (prevProps.account !== this.props.account) {
            this.refresh();
        }
    }

    public render(): React.ReactNode {
        return <div className="data-source-grid-container">
            <Label>Select the storage container of your data</Label>
            <DataTable
                enableShimmer={!this.state.isDataLoaded}
                items={(this.state && this.state.containers) || []}
                itemsPerPage={10}
                selectCallback={this.props.onContainerSelected}
                sortColumnFieldName="name"
                columns={[
                    {
                        field: "name"
                    },
                    {
                        field: "type"
                    },
                ]}
            />
        </div>;
    }

    protected readonly getData = async () => {
        this.setState({ isDataLoaded: false });
        const containers = await this.services.storageService.listContainer(this.props.account);
        if (!containers) {
            return;
        }

        this.setState({ containers: containers.value, isDataLoaded: true });
        if (this.props.autoSelect && this.props.defaultContainerName && containers.value) {
            const defaultContainer = containers.value.find((container) => container.name === this.props.defaultContainerName);
            if (defaultContainer) {
                this.props.onContainerSelected(defaultContainer);
            }
        }
    }
}
