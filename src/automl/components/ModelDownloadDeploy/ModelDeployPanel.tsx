import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { Icon, IPanelProps, Link, Panel, PanelType, ProgressIndicator } from "office-ui-fabric-react";
import * as React from "react";
import { PageNames } from "../../common/PageNames";
import { safeParseJson } from "../../common/utils/safeParseJson";
import { saveAs } from "../../common/utils/saveAs";
import { getThemeNeutralPrimary } from "../../common/utils/theme/getThemeNeutralPrimary";
import { defaultSdkVersion } from "../../services/JasmineServiceJsonDefinition";
import { ModelManagementService } from "../../services/ModelManagementService";
import { RunHistoryService } from "../../services/RunHistoryService";
import { BaseComponent } from "../Base/BaseComponent";

import "./ModelDeployPanel.scss";

const scoringTemplate = `
import pickle
import json
import azureml.train.automl
import pandas as pd
from sklearn.externals import joblib
from azureml.core.model import Model


def init():
    global model
    model_path = Model.get_model_path(model_name='##modelid##')
    model = joblib.load(model_path)

def run(rawdata):
    try:
        data = json.loads(rawdata)['data']
        df = pd.DataFrame(data,columns=##featureColumns##)
        result = model.predict(df)
    except Exception as e:
        result = str(e)
        return json.dumps({"error": result})
    return json.dumps({"result": result.tolist()})
`;

const condaEnvTemplate = `
# Conda environment specification. The dependencies defined in this file will
# be automatically provisioned for runs with userManagedDependencies=False.
# Details about the Conda environment file format:
# https://conda.io/docs/user-guide/tasks/manage-environments.html#create-env-file-manually


name: project_environment
dependencies:
  # The python interpreter version.
  # Currently Azure ML only supports 3.5.2 and later.
- python=3.6.2

- pip:
  - azureml-sdk[automl]==##sdkVersion##
- numpy
- scikit-learn
- py-xgboost<=0.80
`;

export interface IModelDeployPanelProps {
    experimentName: string | undefined;
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
    modelUri: string | undefined;
    modelId: string | undefined;
    onCancel(): void;
    onModelRegister(): void;
}

export interface IModelDeployPanelState {
    registering: boolean;
    modelId: string | undefined;
    primaryMetric: string | undefined;
}

export class ModelDeployPanel extends BaseComponent<IModelDeployPanelProps, IModelDeployPanelState, {
    modelManagementService: ModelManagementService;
    runHistoryService: RunHistoryService;
}> {
    protected serviceConstructors = {
        modelManagementService: ModelManagementService,
        runHistoryService: RunHistoryService
    };
    protected getData = undefined;

    constructor(props: IModelDeployPanelProps) {
        super(props);
        this.state = {
            registering: false,
            modelId: this.props.modelId,
            primaryMetric: this.props.parentRun && this.props.parentRun.properties && this.props.parentRun.properties.primary_metric
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
                <ol className="workflow">
                    <li>
                        <h3 className="workflow-title">Register Model</h3>
                        <p className="workflow-description">
                            First step in deployment is to register the model in Azure machine learning service model registry.
                            Once registered, use the scoring script and the environment script files below to deploy.
                        </p>
                        {this.renderRegisterModel()}
                    </li>
                    <li>
                        <h3 className="workflow-title">Download Scoring Script</h3>
                        <p className="workflow-description">
                            The scoring script is required to generate the image for deployment. It contains the code to do the predictions on input data.
                        </p>
                        <Link key="scoring" disabled={!this.state.modelId} onClick={this.downloadScoringFile}>Download Scoring Script</Link>
                    </li>
                    <li>
                        <h3 className="workflow-title">Download Environment Script</h3>
                        <p className="workflow-description">
                            The environment script is required to generate the image for deployment. It contains the Conda dependencies required to run the web service.
                        </p>
                        <Link key="environment" disabled={!this.state.modelId} onClick={this.getCondaEnvFile}>Download Environment Script</Link>
                    </li>
                    <li>
                        <h3 className="workflow-title">Deploy Model</h3>
                        <p className="workflow-description">
                            After the model is registered and you have downloaded the scoring and the environment scripts, you can deploy the model.
                        </p>
                        <Link key="help" target="_blank" href="https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-create-portal-experiments#deploy-model">
                            Learn more about deploying models <Icon iconName="NavigateExternalInline" />
                        </Link>
                    </li>
                </ol>
            </Panel>
        </>;
    }

    private readonly renderRegisterModel = () => {
        if (this.state.registering) {
            return <ProgressIndicator description="Registering Model..." />;
        }
        if (this.state.modelId) {
            return <div>Model has been registered</div>;
        }

        return <Link key="register" onClick={this.registerModel}>Register Model</Link>;
    }

    private readonly downloadScoringFile = async () => {
        if (!this.state.modelId) {
            return;
        }
        this.logUserAction("DownloadScoringFile",
            { modelId: this.state.modelId, experimentName: this.props.experimentName, runId: this.props.run && this.props.run.runId });
        const dataPrepJson = this.props.parentRun && this.props.parentRun.properties && this.props.parentRun.properties.DataPrepJsonString;
        if (!dataPrepJson) {
            return;
        }
        const featureColumns = JSON.stringify(safeParseJson(safeParseJson(`"${dataPrepJson}"`)).features);
        const content = scoringTemplate.replace("##modelid##", this.state.modelId)
            .replace("##featureColumns##", featureColumns);
        saveAs(new Blob([content]), "scoring.py");
    }

    private readonly registerModel = async () => {
        if (!this.props.run || !this.props.modelUri || !this.props.experimentName) {
            return;
        }
        this.setState({ registering: true });
        const asset = await this.services.modelManagementService.createAsset(
            `${this.props.experimentName}`,
            `${this.props.run.runId}_Model`,
            this.props.modelUri
        );
        this.logUserAction("RegisterModel",
            { modelId: this.state.modelId, experimentName: this.props.experimentName, runId: this.props.run.runId });
        if (!asset || !asset.id) {
            return;
        }
        const model = await this.services.modelManagementService.registerModel(
            `${this.props.experimentName}`,
            `${this.props.run.runId}_Model`,
            asset.id,
            "application/json",
            this.props.run.runId,
            this.props.experimentName
        );
        if (!model) {
            this.setState({ registering: false });
            return;
        }
        const modelId = model.name;
        const updateResult = await this.services.runHistoryService.updateTag(this.props.run, this.props.experimentName, "model_id", modelId);
        if (!updateResult) {
            this.setState({ registering: false });
            return;
        }
        this.props.onModelRegister();
        this.setState({ registering: false, modelId });
    }

    private readonly getCondaEnvFile = () => {
        const content = condaEnvTemplate.replace("##sdkVersion##", this.getSdkVersion());
        this.logUserAction("DownloadCondaFile",
            { experimentName: this.props.experimentName, runId: this.props.run && this.props.run.runId });
        saveAs(new Blob([content]), "condaEnv.yml");
    }

    private readonly getSdkVersion = () => {
        if (!this.props.run
            || !this.props.run.properties
            || !this.props.run.properties.dependencies_versions) {
            return defaultSdkVersion;
        }
        const dependenciesVersions = safeParseJson(this.props.run.properties.dependencies_versions);
        if (!dependenciesVersions
            || !dependenciesVersions["azureml-train-automl"]) {
            return defaultSdkVersion;
        }
        return dependenciesVersions["azureml-train-automl"];
    }

    private readonly renderHeader = (props?: IPanelProps) => {
        const color = getThemeNeutralPrimary(props);

        return (
            this.context.pageName === PageNames.ParentRun ?
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
                </div>
        );
    }

}
