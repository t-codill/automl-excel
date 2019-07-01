import { Link, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
import { WorkspaceError } from "../common/context/IWorkspaceProps";

import "./ErrorMessageBar.scss";

export interface IError {
    error: WorkspaceError;
    count: number;
}

export interface IErrorMessageBarProps { error: IError; }

export class ErrorMessageBar extends React.PureComponent<
    IErrorMessageBarProps,
    {
        dismissed: boolean;
        showingDetail: boolean;
        errorDetail: string | undefined;
    }> {
    constructor(props: IErrorMessageBarProps) {
        super(props);
        this.state = {
            dismissed: false,
            showingDetail: false,
            errorDetail: this.props.error.error.response
                && (
                    this.props.error.error.response.bodyAsText
                    || this.props.error.error.response.body
                    || undefined
                )
        };
    }
    public render(): React.ReactNode {
        if (this.state.dismissed) {
            return <></>;
        }

        return <>
            <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                onDismiss={this.dismiss}
                dismissButtonAriaLabel="Close"
                actions={this.renderCount(this.props.error.count)}>
                <div className="error-message-text">
                    {this.renderMessage(this.props.error.error.message)}
                </div>
                {this.renderDetailLink()}
                {
                    this.state.showingDetail && this.state.errorDetail &&
                    <pre className="error-detail">
                        {this.state.errorDetail}
                    </pre>
                }
            </MessageBar>
        </>;
    }

    private readonly renderMessage = (message: string) => {
        return <div className="error-content" title={message}> {message}</div >;
    }

    private readonly renderCount = (count: number) => {
        if (count > 1) {
            return <div className="error-counter">{count}</div>;
        }
        return <></>;
    }

    private readonly renderDetailLink = () => {
        if (!this.state.errorDetail) {
            return undefined;
        }

        if (this.state.showingDetail) {
            return <Link onClick={this.hideDetail}>Hide more details</Link>;
        }

        return <Link onClick={this.showDetail}>Show more details</Link>;
    }
    private readonly dismiss = () => {
        this.setState({ dismissed: true });
    }
    private readonly showDetail = () => {
        this.setState({ showingDetail: true });
    }
    private readonly hideDetail = () => {
        this.setState({ showingDetail: false });
    }
}
