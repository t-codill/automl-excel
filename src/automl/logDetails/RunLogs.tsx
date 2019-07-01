import { ArtifactAPIModels } from "@vienna/artifact";
import { RunHistoryAPIsModels } from "@vienna/runhistory";
import JSZip from "jszip";
import { Label, Link, Pivot, PivotItem } from "office-ui-fabric-react";
import path from "path";
import * as React from "react";
import { saveAs } from "../common/utils/saveAs";
import { BaseComponent } from "../components/Base/BaseComponent";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { ArtifactService, IArtifact } from "../services/ArtifactService";
import { RunLogContent } from "./RunLogContent";

export interface IRunLog extends IArtifact {
    logName: string;
    prefix: string;
}

export class RunLogs extends BaseComponent<
    { run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined },
    {
        runIdSelected: string | undefined;
        artifactpathSelected: string | undefined;
        logs: IRunLog[];
        downloadingLogs: boolean;
    },
    { artifactService: ArtifactService }> {
    protected readonly serviceConstructors = { artifactService: ArtifactService };

    public render(): React.ReactNode {
        if (!this.props.run || !this.state || !this.state.logs) {
            return <PageLoadingSpinner />;
        }

        const logTabs = this.state.logs.map((log) => {
            return (
                <PivotItem
                    key={log && log.logName}
                    headerText={log && log.logName}>
                    <Label>
                        <RunLogContent runLog={log} />
                    </Label>
                </PivotItem>
            );
        });

        return <>
            {
                (this.state && this.state.downloadingLogs)
                    ? <PageLoadingSpinner />
                    : <Link onClick={this.downloadAll}>Download all</Link>}
            <Pivot>
                {logTabs}
            </Pivot>
        </>;
    }

    protected readonly getData = async () => {
        if (!this.props.run || !this.props.run.runId) {
            return;
        }
        const artifacts = await this.services.artifactService.getAllArtifacts(this.props.run.runId);
        if (!artifacts) {
            return;
        }
        let setupLogs: IRunLog[];
        const setupRunId = this.props.run.properties && this.props.run.properties.SetupRunId;
        if (setupRunId) {
            const setupArtifacts = await this.services.artifactService.getAllArtifacts(setupRunId);
            if (!setupArtifacts) {
                return;
            }
            setupLogs = this.getLogs("setup_", setupArtifacts);
        }
        else {
            setupLogs = [];
        }
        this.setState({
            logs: [...this.getLogs("", artifacts), ...setupLogs]
        });
    }
    private readonly downloadAll = async () => {
        this.setState({ downloadingLogs: true });
        const contents = await this.services.artifactService.getAllContents(this.state.logs);
        if (!contents) {
            return;
        }
        const zip = new JSZip();
        for (let i = 0; i < this.state.logs.length; i++) {
            const content = contents[i];
            if (content) {
                zip.file(this.state.logs[i].prefix ? path.join(this.state.logs[i].prefix, this.state.logs[i].path) : this.state.logs[i].path, content);
            }
        }
        const zipContent = await zip.generateAsync({ type: "blob" });
        saveAs(zipContent, "log.zip");
        this.setState({ downloadingLogs: false });
    }

    private readonly getLogs = (prefix: string, artifacts: ArtifactAPIModels.ArtifactDto[]): IRunLog[] => {
        const logs = artifacts.map((artifact) => {
            return {
                logName: prefix + path.basename(artifact.path || ""),
                prefix,
                path: artifact.path || "",
                container: artifact.container || "",
                origin: artifact.origin || ""
            };
        });
        return logs;
    }
}
