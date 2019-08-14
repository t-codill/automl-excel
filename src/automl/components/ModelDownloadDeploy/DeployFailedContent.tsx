import { Link, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
import { saveAs } from "../../common/utils/saveAs";
import { ModelManagementService } from "../../services/ModelManagementService";
import { BaseComponent } from "../Base/BaseComponent";

export interface IDeployFailedContentProps {
    deployName: string;
    startTime: string;
}
export interface IDeployFailedContentState {
    deployLog: string | undefined;
}

export class DeployFailedContent extends BaseComponent<
    IDeployFailedContentProps,
    IDeployFailedContentState, {
        modelManagementService: ModelManagementService;
    }>  {
    protected serviceConstructors = {
        modelManagementService: ModelManagementService
    };

    constructor(props: IDeployFailedContentProps) {
        super(props);
        this.state = {
            deployLog: undefined
        };
    }

    public readonly render = (): React.ReactNode => {
        return (
            <>
                <MessageBar messageBarType={MessageBarType.error}>
                    <strong>{this.props.deployName}</strong> failed to deploy. <br /><br />
                    <Link onClick={this.downloadDeployLog}>Download logs</Link> for details <br /><br />
                    Last deployment started on {this.props.startTime}.
                </MessageBar>
            </>
        );
    }

    protected readonly getData = async () => {
        const deployLog = await this.services.modelManagementService.getDeployLogs(this.props.deployName);
        this.setState({ deployLog });
    }

    private readonly downloadDeployLog = async () => {
        if (!this.state.deployLog) {
            return;
        }
        saveAs(new Blob([this.state.deployLog]), "deployLog.txt");
    }
}
