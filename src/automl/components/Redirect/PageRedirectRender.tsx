import * as React from "react";
import { generatePath, Redirect } from "react-router-dom";
import { Main } from "../../Main";
import { BaseComponent } from "../Base/BaseComponent";

export class PageRedirectRender extends BaseComponent<{
    noPush: boolean;
    expendedRoutePath: string;
}, {}, {}> {
    protected serviceConstructors = {};
    protected getData = undefined;
    public render(): React.ReactNode {
        if (this.props.noPush) {
            return <Redirect to={this.context.flight.appendQueryParam(`${generatePath(Main.routePath, {
                resourceGroupName: this.context.resourceGroupName,
                subscriptionId: this.context.subscriptionId,
                workspaceName: this.context.workspaceName
            })}/${this.props.expendedRoutePath}`)} push={false} />;
        }
        else {
            return <Redirect to={this.context.flight.appendQueryParam(`${generatePath(Main.routePath, {
                resourceGroupName: this.context.resourceGroupName,
                subscriptionId: this.context.subscriptionId,
                workspaceName: this.context.workspaceName
            })}/${this.props.expendedRoutePath}`)} push={true} />;
        }

    }
}
