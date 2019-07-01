import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { isEqual, orderBy } from "lodash";
import { Icon, Link } from "office-ui-fabric-react";
import * as React from "react";
import { PageNames } from "../common/PageNames";
import { generateRunName } from "../common/utils/generateRunName";
import { safeParseJson } from "../common/utils/safeParseJson";
import { BaseComponent } from "../components/Base/BaseComponent";
import { ModelDeploy } from "../components/ModelDownloadDeploy/ModelDeploy";
import { ModelDownload } from "../components/ModelDownloadDeploy/ModelDownload";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { ArtifactService } from "../services/ArtifactService";
import { IParentRunData } from "./ParentRun";
import { IParentRunGridProps } from "./ParentRunGrid";

export interface IParentRunModelState {
    modelName: string | undefined;
    uri: string | undefined;
    bestRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
}

export class ParentRunModel extends BaseComponent<IParentRunGridProps, IParentRunModelState, { artifactService: ArtifactService }> {

    protected serviceConstructors = { artifactService: ArtifactService };
    constructor(props: IParentRunGridProps) {
        super(props);
        this.state = {
            modelName: undefined,
            uri: undefined,
            bestRun: undefined
        };
    }

    public async componentDidUpdate(prevProps: IParentRunData): Promise<void> {
        if (isEqual(this.props.childRuns, prevProps.childRuns)) {
            return;
        }
        await this.refresh();
    }

    public readonly render = (): React.ReactNode => {
        if (!this.props || !this.props.run || !this.props.childRuns) {
            return <PageLoadingSpinner />;
        }

        return <>
            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <ModelDownload
                    pageName={PageNames.ParentRun}
                    experimentName={this.props.experimentName}
                    run={this.state.bestRun}
                    modelName={this.state.modelName}
                    modelUri={this.state.uri} />
                <ModelDeploy
                    pageName={PageNames.ParentRun}
                    experimentName={this.props.experimentName}
                    run={this.state.bestRun}
                    parentRun={this.props.run}
                    modelName={this.state.modelName}
                    modelUri={this.state.uri}
                    modelId={this.state.bestRun && this.state.bestRun.tags && this.state.bestRun.tags.model_id}
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
        if (!this.props.childRuns || !this.props.run || !this.props.run.properties) {
            this.setState({
                bestRun: undefined,
                modelName: undefined,
                uri: undefined
            });
            return;
        }
        const min = safeParseJson(this.props.run.properties.AMLSettingsJsonString).metric_operation === "minimize";
        const scoredRuns = this.props.childRuns.map((r) => ({
            ...r,
            runId: r.runId,
            parentRunId: r.parentRunId,
            status: r.status,
            score: r.properties && parseFloat(r.properties.score)
        }));

        const sortedRuns = orderBy(scoredRuns, ["score"], [min ? "asc" : "desc"]);
        for (const bestRun of sortedRuns) {
            if (bestRun.score === undefined || isNaN(bestRun.score)) {
                continue;
            }
            const uri = await this.services.artifactService.getModelUrl({
                runId: bestRun.runId,
                parentRunId: bestRun.parentRunId,
                status: bestRun.status
            });
            if (!uri) {
                continue;
            }
            this.setState({
                bestRun,
                modelName: generateRunName(bestRun),
                uri
            });
            return;
        }
        this.setState({
            bestRun: undefined,
            modelName: undefined,
            uri: undefined
        });
    }
}
