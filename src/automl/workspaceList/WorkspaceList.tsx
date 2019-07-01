import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import * as React from "react";
import { BaseContext } from "../common/context/BaseContext";
import { getResourceGroupName } from "../common/utils/getResourceGroupName";
import { nameof } from "../common/utils/nameof";
import { DataTable } from "../components/DataTable/DataTable";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { BaseRedirectLink } from "../components/Redirect/PageRedirect";
import { Main } from "../Main";
import { WorkSpaceService } from "../services/WorkSpaceService";

export interface IWorkspaceListProps {
    subscriptionId: string;
}

export class WorkspaceList extends React.Component<IWorkspaceListProps, {
    workspaces: AzureMachineLearningWorkspacesModels.Workspace[] | undefined;
}> {
    public static routePath = `/subscriptions/:${nameof<IWorkspaceListProps>("subscriptionId")}`;
    public static contextType = BaseContext;
    public context!: React.ContextType<typeof BaseContext>;
    private workSpaceService!: WorkSpaceService;
    public componentDidMount(): void {
        this.workSpaceService = new WorkSpaceService({
            ...this.props,
            ...this.context,
            resourceGroupName: "",
            workspaceName: "",
            discoverUrls: {},
            location: "",
            onError: () => { return; }
        });
        this.loadData();
    }
    public componentWillUnmount(): void {
        this.workSpaceService.dispose();
    }
    public render(): React.ReactNode {
        if (!this.state || !this.state.workspaces) {
            return <PageLoadingSpinner />;
        }

        return (
            <DataTable
                items={this.state.workspaces}
                sortColumnFieldName="name"
                columns={[
                    { field: "name", minWidth: 200, maxWidth: 500, render: this.renderWorkSpaceLink },
                    { field: "workspaceId", minWidth: 200 }
                ]}
            />
        );
    }

    private readonly renderWorkSpaceLink = (content: React.ReactNode, data: AzureMachineLearningWorkspacesModels.Workspace) => {
        if (!data.workspaceId) {
            return undefined;
        }
        return BaseRedirectLink(content, Main, {
            subscriptionId: this.props.subscriptionId,
            resourceGroupName: getResourceGroupName(data.id) || "",
            workspaceName: data.name || ""
        });
    }

    private async loadData(): Promise<void> {
        const workspaces = await this.workSpaceService.listWorkspaces();
        if (!workspaces) {
            return;
        }
        this.setState({ workspaces });
    }
}
