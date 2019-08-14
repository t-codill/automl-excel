import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { orderBy } from "lodash";
import moment from "moment";
import * as React from "react";
import { ModelManagementService } from "../../services/ModelManagementService";
import { BaseComponent } from "../Base/BaseComponent";
import { PageLoadingSpinner } from "../Progress/PageLoadingSpinner";
import { DeployFailedContent } from "./DeployFailedContent";
import { DeployRunningContent } from "./DeployRunningContent";
import { DeploySucceedContent } from "./DeploySucceedContent";

export interface IDeployStatusProps {
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto;
    operationId: string | undefined;
}

export interface IDeployStatusState {
    isLoading: boolean;
    status: string | undefined;
    startTime: string;
    scoringUri: string | undefined;
    deployName: string | undefined;
}

const nonAutoRefreshStatus: Set<string | undefined> = new Set(["Succeeded", "Failed"]);

export class DeployStatus extends BaseComponent<IDeployStatusProps, IDeployStatusState, {
    modelManagementService: ModelManagementService;
}> {
    protected autoRefreshInMs = 10000;
    protected serviceConstructors = {
        modelManagementService: ModelManagementService
    };

    public constructor(props: IDeployStatusProps) {
        super(props);
        this.state = {
            isLoading: true,
            status: undefined,
            startTime: "",
            scoringUri: undefined,
            deployName: undefined
        };
    }

    public render(): React.ReactNode {
        if (this.state.isLoading) {
            return <PageLoadingSpinner />;
        }
        if (!this.state.deployName) {
            return <></>;
        }
        return <>
            {this.state.status === "Succeeded" && <DeploySucceedContent
                deployName={this.state.deployName}
                startTime={this.state.startTime}
                scoringUri={this.state.scoringUri}
            />}
            {this.state.status === "Failed" && <DeployFailedContent
                deployName={this.state.deployName}
                startTime={this.state.startTime}
            />}
            {this.state.status === "Running" && <DeployRunningContent
                run={this.props.run}
                deployName={this.state.deployName}
                startTime={this.state.startTime}
            />}
        </>;
    }

    public componentDidUpdate(prevProps: IDeployStatusProps, prevState: IDeployStatusState): void {
        if (prevProps.operationId !== this.props.operationId || prevState.status !== this.state.status) {
            this.autoRefreshEnabled = undefined;
            this.refresh();
            return;
        }
    }

    protected readonly getData = async () => {
        const lastDeploy = await this.getLatestDeploy();
        const lastDeployName = lastDeploy && lastDeploy.name;
        const lastDeployOperationId = (lastDeploy && lastDeploy.operationId) || (this.props.run && this.props.run.tags && this.props.run.tags.operation_id);
        if (!lastDeployOperationId || !lastDeployName) {
            this.setState({
                isLoading: false
            });
            return;
        }
        const lastDeployStatus = await this.services.modelManagementService.getDeployStatus(lastDeployOperationId);
        if (!lastDeployStatus) {
            this.setState({
                isLoading: false
            });
            return;
        }
        if (this.autoRefreshEnabled === undefined) {
            this.changeAutoRefresh(!nonAutoRefreshStatus.has(lastDeployStatus.state));
        }
        const scoringUri = await this.services.modelManagementService.getScoringUriById(lastDeployName);
        const startTime = moment(lastDeployStatus.createdTime)
            .format("LLL");

        this.setState({
            isLoading: false,
            startTime,
            status: lastDeployStatus.state,
            scoringUri,
            deployName: lastDeployName
        });
    }

    // tslint:disable-next-line: no-any
    private readonly getLatestDeploy = async (): Promise<any> => {
        const deployList = await this.services.modelManagementService.getDeployListByRunId(this.props.run && this.props.run.runId);
        if (!deployList || deployList.length < 1) {
            return undefined;
        }
        const sortedDeploy = orderBy(deployList, "createdTime", "desc");
        return sortedDeploy[0];
    }
}
