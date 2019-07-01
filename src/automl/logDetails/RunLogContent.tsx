import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import { BaseComponent } from "../components/Base/BaseComponent";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { ArtifactService } from "../services/ArtifactService";
import { IRunLog } from "./RunLogs";

export interface IRunLogProps {
    runLog: IRunLog;
    refreshTimestamp?: number;
}
export class RunLogContent extends BaseComponent<IRunLogProps,
    { content: string | undefined },
    { artifactService: ArtifactService }> {
    protected readonly header = "Run Detail";
    protected readonly serviceConstructors = { artifactService: ArtifactService };

    public render(): React.ReactNode {
        if (!this.state || !this.state.content) {
            return <PageLoadingSpinner />;
        }
        const options = {
            readOnly: true,
            automaticLayout: true
        };

        return <MonacoEditor
            language="text"
            theme={this.context.theme === "dark" ? "vs-dark" : "vs"}
            value={this.state.content}
            options={options}
        />;
    }

    public componentDidUpdate(prevProps: IRunLogProps): void {
        if (prevProps.refreshTimestamp !== this.props.refreshTimestamp) {
            this.refresh();
        }
    }
    protected getData = async () => {
        const content = await this.services.artifactService.getContent(this.props.runLog);
        if (!content) {
            return;
        }

        this.setState({ content });
    }
}
