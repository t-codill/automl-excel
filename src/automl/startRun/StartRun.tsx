import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { StorageManagementModels } from "@azure/arm-storage";
import { Models } from "@azure/storage-blob";
import * as React from "react";
import { PageNames } from "../common/PageNames";
import { ICsvData } from "../common/utils/csv";
import { logSerializers } from "../common/utils/logSerializers";
import { BasePage } from "../components/Base/BasePage";
import { ConfirmationDialog } from "../components/Dialog/ConfirmationDialog";
import { PopupProgressIndicator } from "../components/Progress/PopupProgressIndicator";
import { PageRedirect } from "../components/Redirect/PageRedirect";
import { ParentRun } from "../parentRun/ParentRun";
import { RunList } from "../runList/RunList";
import { AdvancedSetting } from "../services/AdvancedSetting";
import { DataStoreService } from "../services/DataStoreService";
import { JasmineService } from "../services/JasmineService";
import { RunHistoryService } from "../services/RunHistoryService";
import { DataSourceStep } from "./dataSourceStep/DataSourceStep";
import { ExperimentStep } from "./experimentStep/ExperimentStep";
import { ISettingsStepParams } from "./settingsSteps/ISettingsStepParams";
import { SettingsStep } from "./settingsSteps/SettingsStep";

import "./StartRun.scss";

export interface IDefaultStorageAccountData {
    defaultAccountName: string | undefined;
    defaultContainerName: string | undefined;
}

export interface IStartRunState {
    experimentName: string | undefined;
    compute: AzureMachineLearningWorkspacesModels.ComputeResource | undefined;

    account: StorageManagementModels.StorageAccount | undefined;
    sasToken: string | undefined;
    container: StorageManagementModels.ListContainerItem | undefined;
    blob: Models.BlobItem | undefined;
    previewData: ICsvData | undefined;
    selectedFeatures: Set<string>;

    dataStoreName: string | undefined;

    cancelled: boolean;
    created: boolean;
    runId: string | undefined;

    creating: boolean;
    creatingTitle?: string;
    creatingDescription?: string;

    experimentStepReadOnly: boolean;

    defaultStorageAccountData: IDefaultStorageAccountData | undefined;
}

export class StartRun
    extends BasePage<{}, IStartRunState, { dataStoreService: DataStoreService; jasmineService: JasmineService; runHistoryService: RunHistoryService }> {
    public static readonly routePath = "startRun";
    protected readonly header = "Create a new automated machine learning experiment";
    protected readonly pageName = PageNames.StartRun;
    protected readonly serviceConstructors = { dataStoreService: DataStoreService, jasmineService: JasmineService, runHistoryService: RunHistoryService };

    constructor(props: {}) {
        super(props);

        this.state = {

            experimentName: undefined,
            compute: undefined,

            account: undefined,
            sasToken: undefined,
            container: undefined,
            blob: undefined,
            previewData: undefined,
            selectedFeatures: new Set<string>(),

            dataStoreName: undefined,

            cancelled: false,
            created: false,
            runId: undefined,
            goBack: false,

            creating: false,

            experimentStepReadOnly: false,

            defaultStorageAccountData: undefined
        };
    }

    public render(): React.ReactNode {
        if (this.state.cancelled) {
            return PageRedirect(RunList, {});
        }

        if (this.state.created && this.state.experimentName && this.state.runId) {
            return PageRedirect(ParentRun, {
                experimentName: this.state.experimentName,
                runId: this.state.runId
            });
        }
        return <>
            {this.renderExperimentStep()}
            {this.renderDataSourceStep()}
            {this.renderSettingsStep()}
            {this.renderPopupProgressIndicator()}
            {this.renderCancelDialog()}
        </>;
    }
    public componentDidUpdate(_prevProps: {}, prevState: IStartRunState): void {
        if (prevState.account !== this.state.account
            || prevState.container !== this.state.container
            || prevState.sasToken !== this.state.sasToken) {
            this.createDataStore();
        }
    }

    protected readonly getData = async () => {
        const defaultStorage = await this.services.dataStoreService.getDefault();
        if (!defaultStorage) {
            return;
        }
        this.setState({
            defaultStorageAccountData: {
                defaultAccountName: defaultStorage.azureStorageSection && defaultStorage.azureStorageSection.accountName,
                defaultContainerName: defaultStorage.azureStorageSection && defaultStorage.azureStorageSection.containerName
            }
        });
    }

    private readonly renderPopupProgressIndicator = (): React.ReactNode => {
        if (!this.state.creating) {
            return undefined;
        }
        return <PopupProgressIndicator
            title={this.state.creatingTitle}
            description={this.state.creatingDescription}
        />;
    }

    private readonly renderCancelDialog = (): React.ReactNode => {
        if (!this.state.goBack) {
            return undefined;
        }
        return <ConfirmationDialog
            title="Cancel New Experiment?"
            subText={`Are you sure you want to cancel creating a new Experiment and go back?`}
            hidden={false}
            onConfirm={this.onCancelConfirm}
            onClose={this.onCancelClose}
        />;
    }

    private readonly renderExperimentStep = (): React.ReactNode => {
        return <ExperimentStep
            readOnly={this.state.experimentStepReadOnly}
            onEditClick={this.onEditExperimentStepClicked}
            experimentName={this.state.experimentName}
            compute={this.state.compute}
            onNext={this.onExperimentStepNext}
            onCancel={this.onCancel}
        />;
    }

    private readonly onEditExperimentStepClicked = () => {
        this.setState({ experimentStepReadOnly: false });
    }

    private readonly onExperimentStepNext = (
        experimentName: string | undefined,
        compute: AzureMachineLearningWorkspacesModels.ComputeResource | undefined) => {
        this.setState({ experimentName, compute, experimentStepReadOnly: true });
    }

    private readonly renderDataSourceStep = (): React.ReactNode => {
        if (!this.state.compute) {
            return undefined;
        }
        const stepClass = this.state.experimentStepReadOnly ? undefined : "hidden_step";
        return <div id="divDataSourceStep" className={stepClass}>
            <DataSourceStep
                account={this.state.account}
                sasToken={this.state.sasToken}
                container={this.state.container}
                blob={this.state.blob}
                previewData={this.state.previewData}
                compute={this.state.compute}
                dataStoreName={this.state.dataStoreName}
                onDataSourceChanged={this.onDataSourceChanged}
                onFeatureSelectionChanged={this.onFeatureSelectionChanged}
                defaultStorageAccountData={this.state.defaultStorageAccountData}
            />
        </div>;
    }

    private readonly onFeatureSelectionChanged = (featureName: string, checked?: boolean) => {
        if (!featureName || !this.state.previewData || checked === undefined) {
            return;
        }
        const selectedFeatures = new Set<string>(this.state.selectedFeatures);

        if (checked) {
            selectedFeatures.add(featureName);
        } else {
            selectedFeatures.delete(featureName);
        }

        this.setState({ selectedFeatures });
    }

    private readonly onDataSourceChanged = (
        account: StorageManagementModels.StorageAccount | undefined,
        sasToken: string | undefined,
        container: StorageManagementModels.ListContainerItem | undefined,
        blob: Models.BlobItem | undefined,
        previewData: ICsvData | undefined) => {
        const selectedFeatures: Set<string> = previewData ? new Set<string>(previewData.header) : new Set<string>();
        this.setState({
            account,
            sasToken,
            container,
            blob,
            previewData,
            selectedFeatures
        });
    }

    private readonly renderSettingsStep = (): React.ReactNode => {
        if (!this.state.compute
            || !this.state.account
            || !this.state.sasToken
            || !this.state.container
            || !this.state.blob
            || !this.state.previewData) {
            return undefined;
        }
        const stepClass = this.state.experimentStepReadOnly ? undefined : "hidden_step";
        return <div className={stepClass}>
            <SettingsStep
                blobHeader={this.state.previewData.header}
                onStart={this.onSettingsStart}
                onCancel={this.onCancel}
                dataStoreName={this.state.dataStoreName}
                compute={this.state.compute.properties}
                selectedFeatures={this.state.selectedFeatures} />
        </div >;
    }

    private readonly onSettingsStart = async (
        params: ISettingsStepParams) => {
        if (!this.state.previewData ||
            !this.state.experimentName ||
            !this.state.compute ||
            !this.state.blob) {
            return;
        }
        this.setState({
            creating: true,
            creatingTitle: "Creating a new automated machine learning run...",
            creatingDescription: "Creating data store..."
        });

        const dataStoreName = this.state.dataStoreName;
        if (!dataStoreName) {
            // cancelled
            return;
        }
        this.setState({ creatingDescription: "Creating a new run..." });
        const runId = await this.createRun(
            this.state.experimentName,
            this.state.compute,
            this.state.blob,
            this.state.previewData,
            this.state.selectedFeatures,
            dataStoreName,
            params
        );
        if (!runId) {
            // TODO change service base to distinguish error vs cancel
            this.setState({ created: false, creating: false });
            return;
        }
        else {
            this.setState({ runId });
        }

        this.setState({ creatingDescription: `Starting a new run with run id ${runId}...` });
        const runResult = await this.startRun(runId, this.state.experimentName, this.state.compute);
        if (!runResult) {
            // TODO change service base to distinguish error vs cancel
            this.setState({ created: false, creating: false });
            return;
        }
        this.setState({ created: true, creating: false });
    }

    private readonly onCancel = () => {
        this.setState({ goBack: true });
    }

    private readonly createDataStore = async () => {
        if (!this.state.account ||
            !this.state.container ||
            !this.state.sasToken) {
            this.setState({ dataStoreName: undefined });
            return;
        }

        const dataStoreName = await this.services.dataStoreService.add(this.state.container, this.state.account, this.state.sasToken);
        if (!dataStoreName) {
            return;
        }
        this.setState({ dataStoreName });
        return;
    }

    private readonly createRun = async (
        experimentName: string,
        compute: AzureMachineLearningWorkspacesModels.ComputeResource,
        blob: Models.BlobItem,
        previewData: ICsvData,
        selectedFeatures: Set<string>,
        dataStoreName: string,
        settingParams: ISettingsStepParams
    ) => {
        if (!settingParams.column ||
            !settingParams.jobType ||
            !settingParams.metric) {
            return undefined;
        }
        const advancedSettingsParams = new AdvancedSetting(settingParams);
        this.logUserAction("CreateRun", {
            settings: logSerializers.advancedSettingsLogSerializer(advancedSettingsParams),
            compute: JSON.stringify(compute),
            blobContentLength: blob.properties && blob.properties.contentLength,
            blobHeaderLength: previewData.header && previewData.header.length,
            blobHasHeader: previewData.hasHeader,
            blobDelimiter: previewData.delimiter
        });
        return this.services.jasmineService.createRun(
            previewData.header.filter((h) => selectedFeatures.has(h)),
            previewData,
            experimentName,
            compute,
            dataStoreName,
            blob.name,
            advancedSettingsParams);
    }

    private readonly startRun = async (
        runId: string,
        experimentName: string,
        compute: AzureMachineLearningWorkspacesModels.ComputeResource) => {
        this.logUserAction("StartRun", {
            compute: JSON.stringify(compute),
            experimentName,
            runId,
        });
        return this.services.jasmineService.startRun(runId, experimentName, compute);
    }

    private readonly onCancelClose = (): void => {
        this.setState({ goBack: false });
    }

    private readonly onCancelConfirm = () => {
        this.setState({ cancelled: true });
    }
}
