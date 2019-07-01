import { ArtifactAPIModels } from "@vienna/artifact";
import JSZip from "jszip";
import { Dropdown, DropdownMenuItemType, ICommandBarItemProps, IDropdownOption, MessageBar } from "office-ui-fabric-react";
import path from "path";
import * as React from "react";
import { ChildRun } from "../childRun/ChildRun";
import { compare } from "../common/compare/index";
import { IDataLoadState } from "../common/IDataLoadState";
import { PageNames } from "../common/PageNames";
import { nameof } from "../common/utils/nameof";
import { saveAs } from "../common/utils/saveAs";
import { BasePage } from "../components/Base/BasePage";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { PageRedirect } from "../components/Redirect/PageRedirect";
import { ParentRun } from "../parentRun/ParentRun";
import { ArtifactService, IArtifact } from "../services/ArtifactService";
import { RunLogContent } from "./RunLogContent";

import "./LogDetails.scss";

export interface ILogDetailsRouteProps {
    experimentName: string;
    runId: string;
    runType: "parent" | "child";
}

export interface IRunLog extends IArtifact {
    logName: string;
    prefix: string;
}

export interface ILogDetailsState extends IDataLoadState {
    selectedOption: IDropdownOption | undefined;
    logs: IRunLog[];
    logOptions: IDropdownOption[];
    refreshTimestamp: number;
}

export class LogDetails extends BasePage<
    ILogDetailsRouteProps,
    ILogDetailsState,
    { artifactService: ArtifactService }> {
    public static routePath = `logs/:${nameof<ILogDetailsRouteProps>("experimentName")}/LogDetails/:${nameof<ILogDetailsRouteProps>("runType")}/:${nameof<ILogDetailsRouteProps>("runId")}`;
    protected readonly header = "Log Detail";
    protected readonly pageName = PageNames.LogDetails;
    protected readonly serviceConstructors = { artifactService: ArtifactService };
    protected readonly navigationBarButtons: ICommandBarItemProps[] = [
        {
            key: "download",
            text: "Download All",
            iconProps: {
                iconName: "Download"
            },
            onClick: () => {
                this.downloadAll();
            }
        }
    ];
    private readonly logsRegex = /(^azureml-logs\/|\.log$)/;

    constructor(props: ILogDetailsRouteProps) {
        super(props);

        this.state = {
            goBack: false,
            isDataLoaded: false,
            selectedOption: undefined,
            logs: [],
            logOptions: [],
            refreshTimestamp: Date.now()
        };
    }
    public readonly render = (): React.ReactNode => {
        if (this.state.goBack) {
            if (this.props.runType === "parent") {
                return PageRedirect(ParentRun, { experimentName: this.props.experimentName, runId: this.props.runId });
            }
            else {
                return PageRedirect(ChildRun, { experimentName: this.props.experimentName, runId: this.props.runId });
            }
        }
        if (!this.state.isDataLoaded) {
            return <PageLoadingSpinner />;
        }
        if (this.state.logOptions.length < 1) {
            return this.renderNoLogs();
        }

        return <div className="log-details-container">
            <div className="log-dropdown-container">
                <Dropdown
                    selectedKey={this.state.selectedOption && this.state.selectedOption.key}
                    onChange={this.onDropDownChange}
                    options={this.state.logOptions}
                />
            </div>
            <div className="log-content-container">
                {
                    this.state.selectedOption &&
                    <RunLogContent
                        key={this.state.selectedOption.data.path}
                        refreshTimestamp={this.state.refreshTimestamp}
                        runLog={this.state.selectedOption.data} />
                }
            </div>

        </div>;
    }

    protected readonly getData = async () => {
        const setupRunId = `${this.props.runId}_setup`;
        const allArtifacts = await this.services.artifactService.getAllArtifactsForRuns([this.props.runId, setupRunId]);

        if (!allArtifacts) {
            return;
        }

        const [artifacts, setupArtifacts] = allArtifacts;

        const runLogs = this.getLogs(artifacts);
        const runLogOptions = this.generateLogOptions(runLogs);

        const setupLogs = this.getLogs(setupArtifacts, "setup_");
        const setupLogOptions = this.generateLogOptions(setupLogs);

        const logs = [...runLogs, ...setupLogs];
        const logOptions = [...runLogOptions, ...setupLogOptions];

        const selectedOption = this.state.selectedOption || logOptions.find((logOption) => logOption.itemType !== DropdownMenuItemType.Header);
        const downloadButton = this.navigationBarButtons.find((button) => {
            return button.key === "download";
        });
        if (downloadButton) {
            downloadButton.disabled = logs.length < 1;
        }

        this.setState({
            isDataLoaded: true,
            selectedOption,
            logs,
            logOptions,
            refreshTimestamp: Date.now()
        });
    }

    private readonly renderNoLogs = () => {
        return <MessageBar>
            No logs are found.
        </MessageBar>;
    }

    private readonly getLogs = (artifacts: ArtifactAPIModels.ArtifactDto[], prefix = "") => {
        const logs = artifacts
            .map((artifact) => ({
                logName: prefix + path.basename(artifact.path || ""),
                prefix,
                path: artifact.path || "",
                container: artifact.container || "",
                origin: artifact.origin || ""
            }));
        return logs.sort((a: IRunLog, b: IRunLog) => compare(a.path, b.path));
    }

    private readonly generateLogOptions = (logs: IRunLog[]) => {
        const logOptions: IDropdownOption[] = [];
        let lastHeader = "";

        for (const log of logs
            .filter((artifact) => artifact.path && this.logsRegex.test(artifact.path))) {
            const header = this.getFolderPath(log.path);
            if (header !== undefined && header !== "" && header !== lastHeader) {
                lastHeader = header;
                logOptions.push(
                    {
                        key: `header-${log.path}`,
                        text: header,
                        itemType: DropdownMenuItemType.Header
                    }
                );
            }
            logOptions.push(
                {
                    key: log.path,
                    text: `-> ${log.logName}`,
                    title: log.logName,
                    data: log
                }
            );
        }
        return logOptions;
    }

    private readonly getFolderPath = (fullPath: string): string | undefined => {
        const paths: string[] = fullPath.split("/");
        paths.splice(-1, 1);
        return paths.join("/");
    }

    private readonly onDropDownChange = (_event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption) => {
        if (!item) {
            return;
        }
        this.setState({ selectedOption: item });
    }

    private readonly downloadAll = async () => {
        const contents = await this.services.artifactService.getAllContents(this.state.logs);
        if (!contents) {
            return;
        }
        this.logUserAction("Download All", { runId: this.props.runId });
        const zip = new JSZip();
        for (let i = 0; i < this.state.logs.length; i++) {
            const content = contents[i];
            if (content) {
                zip.file(this.state.logs[i].prefix ? path.join(this.state.logs[i].prefix, this.state.logs[i].path) : this.state.logs[i].path, content);
            }
        }
        const zipContent = await zip.generateAsync({ type: "blob" });
        saveAs(zipContent, "log.zip");
    }
}
