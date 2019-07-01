import * as React from "react";
import { generatePath } from "react-router-dom";
import { Main } from "../../Main";
import { BaseComponent } from "../Base/BaseComponent";
import { RedirectLink } from "./RedirectLink";

export class PageRedirectLinkRender extends BaseComponent<{
    expendedRoutePath: string;
}, {}, {}> {
    protected serviceConstructors = {};
    protected getData = undefined;
    public render(): React.ReactNode {
        return <RedirectLink to={this.context.flight.appendQueryParam(`${generatePath(Main.routePath, {
            resourceGroupName: this.context.resourceGroupName,
            subscriptionId: this.context.subscriptionId,
            workspaceName: this.context.workspaceName
        })}/${this.props.expendedRoutePath}`)} >
            {this.props.children}
        </RedirectLink>;
    }
}
