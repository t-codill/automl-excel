import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { DefaultButton, Icon, IPanelProps, Link, MessageBar, MessageBarType, Panel, PanelType, PrimaryButton, ProgressIndicator } from "office-ui-fabric-react";
import * as React from "react";
import { PageNames } from "../../common/PageNames";
import { getCondaFileFromTemplate } from "../../common/utils/deployment/getCondaFileFromTemplate";
import { getScoringFileFromTemplate } from "../../common/utils/deployment/getScoringFileFromTemplate";
import { hasDefaultScoring } from "../../common/utils/deployment/hasDefaultScoring";
import { getModelNameFromRunId } from "../../common/utils/getModelNameFromRunId";
import { getThemeNeutralPrimary } from "../../common/utils/theme/getThemeNeutralPrimary";
import { ArtifactService } from "../../services/ArtifactService";
import { ModelManagementService } from "../../services/ModelManagementService";
import { BaseComponent } from "../Base/BaseComponent";
import { Form } from "../Form/Form";
import { FormTextInput } from "../Form/FormTextInput";
import { Validators } from "../Form/Validators";
import { CondaFileSelector } from "./CondaFileSelector";
import { IDeployModelParams } from "./IDeployModelParams";
import { ScoringScriptSelector } from "./ScoringScriptSelector";

import "./ModelDeployPanel.scss";

export interface IModelDeployPanelProps {
    pageName: PageNames;
    experimentName: string | undefined;
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
    modelUri: string | undefined;
    scoringUri: string | undefined | null;
    condaUri: string | undefined | null;
    onCancel(): void;
    onModelDeploy(operationId: string): void;
}

export interface IModelDeployPanelState {
    deploying: boolean;
    modelId: string | undefined;
    primaryMetric: string | undefined;
    autoGenerateScoringFile: boolean;
    autoGenerateCondaFile: boolean;
    errorMessage: string | undefined;
}

export class ModelDeployPanel extends BaseComponent<IModelDeployPanelProps, IModelDeployPanelState, {
    modelManagementService: ModelManagementService;
    artifactService: ArtifactService;
}> {
    protected serviceConstructors = {
        modelManagementService: ModelManagementService,
        artifactService: ArtifactService
    };
    protected getData = undefined;

    constructor(props: IModelDeployPanelProps) {
        super(props);
        this.state = {
            deploying: false,
            modelId: undefined,
            primaryMetric: this.props.parentRun && this.props.parentRun.properties && this.props.parentRun.properties.primary_metric,
            autoGenerateScoringFile: true,
            autoGenerateCondaFile: true,
            errorMessage: undefined
        };
    }

    public readonly render = (): React.ReactNode => {
        return <>
            <Panel
                isOpen={true}
                type={PanelType.medium}
                onDismiss={this.props.onCancel}
                isHiddenOnDismiss={true}
                onRenderHeader={this.renderHeader}
                closeButtonAriaLabel="Close">
                <Form onSubmit={this.deployModel}>
                    {this.state.errorMessage ? <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar> : <></>}
                    <FormTextInput<IDeployModelParams, "name">
                        field="name"
                        required={true}
                        label="Deployment name"
                        placeholder="Deployment name"
                        ariaLabel="Please enter deployment name here"
                        validators={[
                            Validators.required("Model name is required"),
                            Validators.regex(/^[a-z][a-z0-9-]{1,15}$/,
                                "Model name should start with a lower case letter, be between 2 and 16 character, and only include letters (a-z), numbers (0-9) and '-'")]}
                    />

                    <FormTextInput<IDeployModelParams, "description">
                        field="description"
                        required={false}
                        multiline={true}
                        label="Deployment description"
                        placeholder="Deployment description"
                        ariaLabel="Please enter deployment description here"
                    />

                    <p>Target: Only Azure Container Instance(ACI) is supported</p>
                    <ScoringScriptSelector onToggle={this.handleScoringToggle} hasDefaultOption={hasDefaultScoring(this.props.parentRun, this.props.scoringUri)} />
                    <CondaFileSelector onToggle={this.handleCondaToggle} />
                    {this.state.deploying ?
                        <ProgressIndicator description="Deploying Model..." /> : undefined}
                    <div className="form-footer">
                        <DefaultButton text="Cancel" onClick={this.props.onCancel} />
                        <PrimaryButton text="Deploy" disabled={this.state.deploying} type="submit" />
                    </div>
                </Form>
            </Panel>
        </>;
    }

    private readonly registerModel = async (run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto,
        modelUri: string, experimentName: string) => {
        const asset = await this.services.modelManagementService.createAsset(
            experimentName,
            `${run.runId}_Model`,
            modelUri
        );
        this.logUserAction("RegisterModel",
            { modelId: this.state.modelId, experimentName: this.props.experimentName, runId: run.runId });
        if (!asset || !asset.id || !run.runId) {
            return;
        }
        const model = await this.services.modelManagementService.registerModel(
            getModelNameFromRunId(run.runId),
            `${run.runId}_Model`,
            asset.id,
            "application/json",
            run.runId,
            experimentName
        );
        if (!model) {
            this.setState({ errorMessage: "Register Model Failed. Please check logs" });
            return;
        }
        const modelId = model.id;
        if (!modelId) {
            this.setState({ errorMessage: "Model Id is invalid. Please check logs" });
            return;
        }
        this.setState({ modelId });
    }

    private readonly renderHeader = (props?: IPanelProps) => {
        const color = getThemeNeutralPrimary(props);
        return (
            this.props.pageName === PageNames.ParentRun ?
                <div className="panel-header" style={{
                    color
                }}>
                    <h2>Deploy Best Model</h2>
                    <p>Best model based on {this.state.primaryMetric}</p>
                </div> :
                <div className="panel-header" style={{
                    color
                }}>
                    <h2>Deploy Model</h2>
                    <p>Deploy the model to a web service which can then be used to predict on new data. &nbsp;
                        <Link target="_blank" href="https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-create-portal-experiments#deploy-model">
                            Learn more <Icon iconName="NavigationExternalInline" />
                        </Link>
                    </p>
                </div>
        );
    }
    private readonly handleCondaToggle = () => {
        this.setState((prev) => {
            return {
                autoGenerateCondaFile: !prev.autoGenerateCondaFile,
            };
        });
    }

    private readonly handleScoringToggle = () => {
        this.setState((prev) => {
            return {
                autoGenerateScoringFile: !prev.autoGenerateScoringFile,
            };
        });
    }

    private readonly readOrUploadCondaFile = async (runId: string, data: IDeployModelParams): Promise<string | undefined> => {
        const condaFilePath = "ModelDeploy/condaEnv.yml";
        if (this.state.autoGenerateCondaFile
            && this.props.run
            && this.props.run.properties
            && this.props.run.properties.conda_env_data_location) {
            return this.props.run.properties.conda_env_data_location;
        }
        const condaFileContent = this.state.autoGenerateCondaFile ? getCondaFileFromTemplate(this.props.run) : data.condaFile;
        if (!condaFileContent) {
            return undefined;
        }
        const condaArtifactId = await this.services.artifactService.uploadArtifact(`dcid.${runId}`, condaFilePath, condaFileContent);
        if (!condaArtifactId) {
            return undefined;
        }
        return this.getArtifactUrl(condaArtifactId);
    }

    private readonly readOrUploadScoringFile = async (runId: string, data: IDeployModelParams): Promise<string | undefined> => {
        const scoringFilePath = "ModelDeploy/scoring.py";
        if (this.state.autoGenerateScoringFile
            && this.props.run
            && this.props.run.properties
            && this.props.run.properties.scoring_data_location) {
            return this.props.run.properties.scoring_data_location;
        }
        const scoringFileContent = this.state.autoGenerateScoringFile ? getScoringFileFromTemplate(this.props.parentRun, runId) : data.scoringFile;
        if (!scoringFileContent) {
            return undefined;
        }
        const scoringArtifactId = await this.services.artifactService.uploadArtifact(`dcid.${runId}`, scoringFilePath, scoringFileContent);
        if (!scoringArtifactId) {
            return undefined;
        }
        return this.getArtifactUrl(scoringArtifactId);
    }

    private readonly getArtifactUrl = (artifactId: string): string => {
        return `aml://artifact/${artifactId}`;
    }

    // tslint:disable-next-line: cyclomatic-complexity
    private readonly deployModel = async (data: IDeployModelParams) => {
        const runId = this.props.run && this.props.run.runId;
        if (!this.props.run || !this.props.run.runId || !runId || !this.props.experimentName || !this.props.modelUri) {
            this.setState({ deploying: false });
            return;
        }
        this.setState({ deploying: true });
        this.logUserAction("DeployModel",
            { deployName: data.name, autoGenerateCondaFile: this.state.autoGenerateCondaFile, autoGenerateScoringFile: this.state.autoGenerateScoringFile });
        await this.registerModel(this.props.run, this.props.modelUri, this.props.experimentName);
        if (!this.state.modelId) {
            this.setState({ deploying: false, errorMessage: "Register Model Failed" });
            return;
        }

        const condaArtifactLocation = await this.readOrUploadCondaFile(runId, data);
        const scoringArtifactLocation = await this.readOrUploadScoringFile(runId, data);
        if (!condaArtifactLocation || !scoringArtifactLocation) {
            this.setState({ deploying: false, errorMessage: "Upload File to Artifact Failed" });
            return;
        }

        const scoringFileName = scoringArtifactLocation.substring(scoringArtifactLocation.lastIndexOf("/") + 1);
        const response = await this.services.modelManagementService.createDeployment(data.name, data.description, runId,
            this.state.modelId,
            condaArtifactLocation,
            scoringFileName,
            scoringArtifactLocation);
        if (response && response.status === 409) {
            this.setState({
                deploying: false,
                errorMessage: `Current workspace already contains a deployment with name ${data.name}`
            });
            return;
        }
        if (!response || response.status !== 202 || !response.operationId) {
            this.setState({
                deploying: false,
                errorMessage: "Create Deployment Failed"
            });
            return;
        }
        this.props.onModelDeploy(response.operationId);
    }
}
