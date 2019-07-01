import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { Icon, Link } from "office-ui-fabric-react";
import React from "react";
import { PageNames } from "../common/PageNames";
import { generateRunName } from "../common/utils/generateRunName";
import { BaseComponent } from "../components/Base/BaseComponent";
import { ModelDeploy } from "../components/ModelDownloadDeploy/ModelDeploy";
import { ModelDownload } from "../components/ModelDownloadDeploy/ModelDownload";
import { RunHistoryService } from "../services/RunHistoryService";

export interface IChildRunModelProps {
    modelUri: string | undefined;
    experimentName: string | undefined;
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
    onModelRegister(): void;
}

export interface IChildRunModelState {
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
}

export class ChildRunModel extends BaseComponent<IChildRunModelProps, IChildRunModelState, { runHistoryService: RunHistoryService }> {
    protected readonly serviceConstructors = { runHistoryService: RunHistoryService };
    public constructor(props: IChildRunModelProps) {
        super(props);
        this.state = {
            parentRun: undefined
        };
    }
    public readonly render = (): React.ReactNode => {
        return <>
            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <ModelDownload
                    pageName={PageNames.ChildRun}
                    experimentName={this.props.experimentName}
                    run={this.props.run}
                    modelName={generateRunName(this.props.run)}
                    modelUri={this.props.modelUri} />
                <ModelDeploy
                    pageName={PageNames.ChildRun}
                    experimentName={this.props.experimentName}
                    modelName={generateRunName(this.props.run)}
                    run={this.props.run}
                    parentRun={this.state.parentRun}
                    modelUri={this.props.modelUri}
                    modelId={this.props.run && this.props.run.tags && this.props.run.tags.model_id}
                    onModelRegister={this.props.onModelRegister} />
            </div>
            <div style={{
                textAlign: "right",
                marginBottom: "1em"
            }}>
                <Link target="_blank" href="https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-create-portal-experiments#deploy-model">
                    Learn more about deploying models <Icon iconName="NavigateExternalInline" />
                </Link>
            </div>
        </>;
    }
    protected readonly getData = async () => {
        if (!this.props.run || !this.props.experimentName || !this.props.run.parentRunId) {
            return;
        }
        const parentRunId = this.props.run.parentRunId;
        const parentRun = await this.services.runHistoryService.getRun(parentRunId, this.props.experimentName);
        if (!parentRun || !parentRun.runId) {
            return;
        }
        this.setState({
            parentRun
        });
    }
}
