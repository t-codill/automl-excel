import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";

import "./RunStatus.scss";

export class RunStatus extends React.Component<{
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
    experimentName?: string;
}, {
    showingLogs: boolean;
}> {
    public render(): React.ReactNode {
        if (!this.props.run) {
            return <PageLoadingSpinner />;
        }
        const messageBarType = this.getMessageBarType(this.props.run);
        return <MessageBar
            className="run-status-bar"
            messageBarType={messageBarType}
            isMultiline={messageBarType === MessageBarType.error}>
            <div className="run-status-text">
                Run is <strong>{this.props.run.status}</strong>.
            </div>
            {messageBarType === MessageBarType.error ? this.renderErrorMessage(this.props.run) : <></>}
        </MessageBar>;
    }

    private readonly getMessageBarType = (run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto) => {
        switch (run.status) {
            case "Completed":
                return MessageBarType.success;
            case "Failed":
            case "Canceled":
                return MessageBarType.error;
            default:
                return MessageBarType.info;
        }
    }

    private readonly renderErrorMessage = (run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto): JSX.Element => {
        let message = "";
        if (run.properties && run.properties.errors) {
            message = run.properties.errors;
        }
        if (run.error && run.error.error && run.error.error.message) {
            message = run.error.error.message;
        }

        if (!message) {
            return <></>;
        }

        message = message
            .split("\\n")
            .join("\n");

        return <pre className="error-content">{message}</pre>;
    }
}
