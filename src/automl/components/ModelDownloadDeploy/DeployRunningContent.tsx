import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";

interface IDeployRunningContentProps {
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto;
    deployName: string;
    startTime: string;
}
export class DeployRunningContent extends React.Component<IDeployRunningContentProps> {
    public render = (): React.ReactNode => {
        return (
            <>
                <MessageBar messageBarType={MessageBarType.info}>
                    Model of Iteration<strong> {this.props.run.properties && this.props.run.properties.iteration} </strong> is deploying to <strong>{this.props.deployName}</strong>.
                    This can take more than 20 minutes to complete.<br /> <br />
                    Deployment started on {this.props.startTime}.
                </MessageBar>
            </>
        );
    }
}
