
import { Link, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
import { BaseComponent } from "../Base/BaseComponent";

export interface IDeploySucceedContentProps {
    deployName: string;
    startTime: string;
    scoringUri: string | undefined;
}

export class DeploySucceedContent extends BaseComponent<
    IDeploySucceedContentProps,
    {}, {}>  {
    protected serviceConstructors = {};

    protected readonly getData = undefined;

    public readonly render = (): React.ReactNode => {
        return (
            <>
                <MessageBar messageBarType={MessageBarType.success}>
                    <strong>{this.props.deployName}</strong> deployed successfully. <br /><br />
                    <strong>Score URI: </strong> <Link href={this.props.scoringUri} target="_blank">{this.props.scoringUri}</Link> <br />
                    {
                        // TODO: Add this back once MMS fixed swagger.json
                        // <strong>Schema: </strong> <Link href={this.getSchemaUrl()} target="_blank">swagger.json</Link> <br /><br />
                    }
                    Deployed since {this.props.startTime}.
                </MessageBar>
            </>
        );
    }

    // TODO: Add this back once MMS fixed swagger.json
    // private readonly getSchemaUrl = (): string | undefined => {
    //     if (!this.state.scoringURI) {
    //         return undefined;
    //     }
    //     const scoringURI = this.state.scoringURI;
    //     return `${scoringURI.substring(0, scoringURI.lastIndexOf("score"))}swagger.json`;
    // }
}
