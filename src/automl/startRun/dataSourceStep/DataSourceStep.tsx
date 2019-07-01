import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { StorageManagementModels } from "@azure/arm-storage";
import { Models } from "@azure/storage-blob";
import { TextField } from "office-ui-fabric-react";
import * as React from "react";
import { ICsvData } from "../../common/utils/csv";
import { IDefaultStorageAccountData } from "../StartRun";
import { BlobPreviewer } from "./BlobPreviewer";
import { BlobSelector } from "./BlobSelector";
import { StorageAccountSelector } from "./StorageAccountSelector";
import { StorageContainerSelector } from "./StorageContainerSelector";

export interface IDataSourceStepProps {
    account: StorageManagementModels.StorageAccount | undefined;
    sasToken: string | undefined;
    container: StorageManagementModels.ListContainerItem | undefined;
    blob: Models.BlobItem | undefined;
    previewData: ICsvData | undefined;
    dataStoreName: string | undefined;
    compute: AzureMachineLearningWorkspacesModels.ComputeResource;
    defaultStorageAccountData: IDefaultStorageAccountData | undefined;
    onDataSourceChanged(
        account: StorageManagementModels.StorageAccount | undefined,
        sasToken: string | undefined,
        container: StorageManagementModels.ListContainerItem | undefined,
        blob: Models.BlobItem | undefined,
        previewData: ICsvData | undefined
    ): void;
    onFeatureSelectionChanged(featureName: string, checked?: boolean): void;
}
export interface IDataSourceStepState {
    step: string;
    autoSelect: boolean;
}
export class DataSourceStep
    extends React.Component<IDataSourceStepProps, IDataSourceStepState> {

    constructor(props: IDataSourceStepProps) {
        super(props);

        this.state = {
            step: "Account",
            autoSelect: true
        };
    }

    public render(): React.ReactNode {
        return <>
            <div className="start-run-step-content">
                {this.renderDataSourceAccount()}
                {this.renderDataSourceContainer()}
                {this.renderDataSourceBlob()}
                {this.renderDataSourcePreview()}
            </div>
        </>;
    }

    private readonly renderDataSourceAccount = (): React.ReactNode => {
        if (this.props.account && this.props.sasToken) {
            return <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                <TextField
                    label="Storage Account"
                    ariaLabel="Storage Account"
                    readOnly={true}
                    iconProps={
                        {
                            iconName: "Edit",
                            style: { fontSize: 12 }
                        }
                    }
                    value={this.props.account.name}
                    onClick={this.changeAccount}
                />
            </div>;
        }
        return <StorageAccountSelector
            account={this.props.account}
            onAccountSelected={this.onAccountSelected}
            defaultStorageAccountName={this.props.defaultStorageAccountData && this.props.defaultStorageAccountData.defaultAccountName}
            autoSelect={this.state.autoSelect}
        />;
    }

    private readonly changeAccount = () => {
        this.setState({ autoSelect: false });
        this.props.onDataSourceChanged(undefined, undefined, undefined, undefined, undefined);
    }

    private readonly onAccountSelected = (
        account: StorageManagementModels.StorageAccount,
        sasToken: string) => {
        this.props.onDataSourceChanged(account, sasToken, undefined, undefined, undefined);
    }

    private readonly renderDataSourceContainer = (): React.ReactNode => {
        if (!this.props.account || !this.props.sasToken) {
            return undefined;
        }
        if (this.props.container) {
            return <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                <TextField
                    label="Storage Container"
                    ariaLabel="Storage Container"
                    readOnly={true}
                    iconProps={
                        {
                            iconName: "Edit",
                            style: { fontSize: 12 }
                        }
                    }
                    value={this.props.container.name}
                    onClick={this.changeContainer}
                />
            </div>;
        }
        return <StorageContainerSelector
            account={this.props.account}
            container={this.props.container}
            defaultContainerName={this.props.defaultStorageAccountData && this.props.defaultStorageAccountData.defaultContainerName}
            onContainerSelected={this.onContainerSelected}
            autoSelect={this.state.autoSelect} />;
    }

    private readonly changeContainer = () => {
        this.props.onDataSourceChanged(this.props.account, this.props.sasToken, undefined, undefined, undefined);
    }

    private readonly onContainerSelected = (container: StorageManagementModels.ListContainerItem) => {
        this.setState({ autoSelect: false });
        this.props.onDataSourceChanged(this.props.account, this.props.sasToken, container, undefined, undefined);
    }

    private readonly renderDataSourceBlob = (): React.ReactNode => {
        if (!this.props.account
            || !this.props.sasToken
            || !this.props.container) {
            return undefined;
        }
        if (this.props.blob) {
            return <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                <TextField
                    label="Blob"
                    ariaLabel="Blob"
                    readOnly={true}
                    iconProps={
                        {
                            iconName: "Edit",
                            style: { fontSize: 12 }
                        }
                    }
                    value={this.props.blob.name}
                    onClick={this.changeBlob}
                />
            </div>;
        }
        return <BlobSelector
            account={this.props.account}
            container={this.props.container}
            sasToken={this.props.sasToken}
            blob={this.props.blob}
            onBlobSelected={this.onBlobSelected} />;
    }

    private readonly changeBlob = () => {
        this.props.onDataSourceChanged(this.props.account, this.props.sasToken, this.props.container, undefined, undefined);
    }

    private readonly onBlobSelected = (blob: Models.BlobItem) => {
        this.props.onDataSourceChanged(this.props.account, this.props.sasToken, this.props.container, blob, undefined);
    }

    private readonly renderDataSourcePreview = (): React.ReactNode => {
        if (!this.props.account
            || !this.props.sasToken
            || !this.props.container
            || !this.props.blob) {
            return undefined;
        }
        return <BlobPreviewer
            account={this.props.account}
            container={this.props.container}
            sasToken={this.props.sasToken}
            blob={this.props.blob}
            compute={this.props.compute}
            dataStoreName={this.props.dataStoreName}
            previewData={this.props.previewData}
            onSetPreviewData={this.onSetPreviewData}
            onFeatureSelectionChanged={this.props.onFeatureSelectionChanged} />;
    }

    private readonly onSetPreviewData = (previewData: ICsvData) => {
        this.props.onDataSourceChanged(this.props.account, this.props.sasToken, this.props.container, this.props.blob, previewData);
    }
}
