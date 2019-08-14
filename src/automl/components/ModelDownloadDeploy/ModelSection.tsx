import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { Icon, Link } from "office-ui-fabric-react";
import React from "react";
import { PageNames } from "../../common/PageNames";
import { generateRunName } from "../../common/utils/generateRunName";
import { ArtifactService } from "../../services/ArtifactService";
import { BaseComponent } from "../Base/BaseComponent";
import { DeployStatus } from "./DeployStatus";
import { ModelDeploy } from "./ModelDeploy";
import { ModelDownload } from "./ModelDownload";

export interface IModelSectionProps {
    experimentName: string;
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto;
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto;
    pageName: PageNames.ParentRun | PageNames.ChildRun;
    onModelDeploy(): void;
}

export interface IModelSectionState {
    modelUri?: string;
    scoringUri?: string;
    condaUri?: string;
    operationId: string | undefined;
}

export class ModelSection extends BaseComponent<IModelSectionProps, IModelSectionState, { artifactService: ArtifactService }> {
    protected readonly serviceConstructors = { artifactService: ArtifactService };
    public constructor(props: IModelSectionProps) {
        super(props);
        this.state = {
            modelUri: undefined,
            scoringUri: undefined,
            condaUri: undefined,
            operationId: undefined
        };
    }
    public readonly render = (): React.ReactNode => {
        return <>
            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <ModelDownload
                    pageName={this.props.pageName}
                    experimentName={this.props.experimentName}
                    run={this.props.run}
                    modelName={generateRunName(this.props.run)}
                    modelUri={this.state.modelUri} />
                <ModelDeploy
                    pageName={this.props.pageName}
                    experimentName={this.props.experimentName}
                    modelName={generateRunName(this.props.run)}
                    run={this.props.run}
                    parentRun={this.props.parentRun}
                    modelUri={this.state.modelUri}
                    scoringUri={this.state.scoringUri}
                    condaUri={this.state.condaUri}
                    onModelDeploy={this.onModelDeployHandler} />
            </div>
            <div style={{
                marginTop: "1em"
            }}>
                <DeployStatus run={this.props.run} operationId={this.state.operationId}/>
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
        const res = await this.services.artifactService.getDeployUri({
            runId: this.props.run.runId,
            parentRunId: this.props.parentRun.runId,
            status: this.props.run.status
        });
        if (!res) {
            return;
        }
        this.setState(res);
    }
    private readonly onModelDeployHandler = (operationId: string) => {
        this.setState({ operationId });
        this.props.onModelDeploy();
    }
}
