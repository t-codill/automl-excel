import { SubscriptionModels } from "@azure/arm-subscriptions";
import * as React from "react";
import { BaseContext } from "../common/context/BaseContext";
import { DataTable } from "../components/DataTable/DataTable";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { BaseRedirectLink } from "../components/Redirect/PageRedirect";
import { SubscriptionService } from "../services/SubscriptionService";
import { WorkspaceList } from "../workspaceList/WorkspaceList";

interface ISubscriptionListStats {
    subscriptions: SubscriptionModels.Subscription[] | undefined;
}
export class SubscriptionList extends React.Component<{}, ISubscriptionListStats> {
    public static routePath = "/";
    public static contextType = BaseContext;
    public context!: React.ContextType<typeof BaseContext>;
    private subscriptionService!: SubscriptionService;
    public componentDidMount(): void {
        this.subscriptionService = new SubscriptionService({
            ...this.props,
            ...this.context,
            subscriptionId: "",
            resourceGroupName: "",
            workspaceName: "",
            discoverUrls: {},
            location: "",
            onError: () => { return; }
        });
        this.loadData();
    }
    public componentWillUnmount(): void {
        this.subscriptionService.dispose();
    }
    public render(): React.ReactNode {
        if (!this.state || !this.state.subscriptions) {
            return <PageLoadingSpinner />;
        }

        return (
            <DataTable
                items={this.state.subscriptions}
                columns={[
                    { field: "displayName", minWidth: 200, maxWidth: 500, render: this.renderSubscriptionLink },
                    { field: "id", minWidth: 200 }
                ]}
                sortColumnFieldName="displayName"
            />
        );
    }

    private readonly renderSubscriptionLink = (content: React.ReactNode, data: SubscriptionModels.Subscription) => {
        if (!data.subscriptionId) {
            return undefined;
        }
        return BaseRedirectLink(content, WorkspaceList, { subscriptionId: data.subscriptionId });
    }

    private async loadData(): Promise<void> {
        const subscriptions = await this.subscriptionService.listSubscriptions();
        if (!subscriptions) {
            return;
        }
        this.setState({ subscriptions });
    }
}
