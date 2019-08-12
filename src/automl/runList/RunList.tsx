//import { RunHistoryChart } from "@mlworkspace/charts";
import { countBy, Dictionary, includes, map, uniq } from "lodash";
import moment from "moment";
import { ICommandBarItemProps } from "office-ui-fabric-react";
import * as React from "react";
import { ChildRun } from "../childRun/ChildRun";
import { PageNames } from "../common/PageNames";
import { processRunHistoryChart } from "../common/utils/processRunHistoryChart";
import { mergeRunStatus, statusMapping } from "../common/utils/run";
import { BasePage } from "../components/Base/BasePage";
import { DataTable } from "../components/DataTable/DataTable";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { PageRedirect, PageRedirectLink } from "../components/Redirect/PageRedirect";
import { ParentRun } from "../parentRun/ParentRun";
import { AccessService } from "../services/AccessService";
import { IRunDtoWithExperimentName, RunHistoryService } from "../services/RunHistoryService";
import { StartRun } from "../startRun/StartRun";
import { Welcome } from "../welcome/Welcome";
import { RunListDateSelector } from "./RunListDateSelector";
import { RunListExperimentSelector } from "./RunListExperimentSelector";
import { RunStatusCardContainer } from "./RunStatusCardContainer";

import "./RunList.scss";

export interface IRunListState {
    runs: IRunDtoWithExperimentName[] | undefined;
    filteredRuns: IRunDtoWithExperimentName[] | undefined;
    uniqExperimentNames: string[] | undefined;
    dateFilter?: Date | undefined;
    experimentFilter?: string[] | undefined;
    statusFilter?: string | undefined;
    redirectToStartRun: boolean;
    runStatistics: Dictionary<number>;
    runHistoryChartData: Dictionary<Dictionary<number>>;
}
export class RunList extends BasePage<{}, IRunListState,
    { runHistoryService: RunHistoryService; accessService: AccessService }
    > {
    public static routePath = "";
    protected header: string | undefined = "Automated Machine Learning Dashboard";
    protected pageName = PageNames.RunList;
    protected readonly noBackButton = true;
    protected readonly serviceConstructors = { runHistoryService: RunHistoryService, accessService: AccessService };
    protected readonly navigationBarButtons: ICommandBarItemProps[] = [
        {
            key: "startRun",
            text: "Create experiment",
            iconProps: {
                iconName: "Add"
            },
            disabled: true,
            onClick: () => {
                this.startNewRun();
            }
        }
    ];

    public render(): React.ReactNode {
        if (!this.state || !this.state.runs) {
            return <PageLoadingSpinner />;
        }
        if (this.state.redirectToStartRun) {
            return PageRedirect(StartRun, {});
        }
        if (this.state.runs.length === 0) {
            return PageRedirect(Welcome, {});
        }
        return (<>
            <div className="run-filter-container">
                <div className="run-filter-action-container">
                    <RunListDateSelector onDateChange={this.handleDateFilterChange} />
                </div>
                <div className="run-filter-action-container">
                    <RunListExperimentSelector
                        isAllSelect={true}
                        experimentNames={this.state.uniqExperimentNames}
                        onExperimentChange={this.handleExperimentFilterChange}
                    />
                </div>
            </div>
            <div className="run-status-container">
                <div className="run-status-card-container">
                    <RunStatusCardContainer
                        runStatus={this.state.runStatistics}
                        onStatusFilterChange={this.handleStatusFilterChange} />
                </div>
                <div className="run-status-chart-container">
                    {<></> /*
                        <RunHistoryChart
                            metric={this.state.runHistoryChartData}
                            theme={this.context.theme}
                            configOverride={{
                                layout: {
                                    margin: {
                                        l: 20,
                                        r: 20,
                                        b: 30,
                                        t: 20
                                    },
                                },
                                config: {
                                    responsive: true,
                                    displayModeBar: false
                                }
                            }} />
                        */}
                </div>
            </div>
            <DataTable
                items={this.state.filteredRuns || []}
                itemsPerPage={15}
                columns={[
                    { field: "experimentName", header: "Experiment", minWidth: 70, maxWidth: 250 },
                    { field: "runId", header: "Run Id", minWidth: 70, maxWidth: 350, render: this.renderRunId },
                    { field: "status", header: "Status", minWidth: 80, maxWidth: 80 },
                    { field: "createdUtc", header: "Created", minWidth: 80, maxWidth: 200 },
                    { field: "startTimeUtc", header: "Start Time", minWidth: 80, maxWidth: 200 },
                    { field: "endTimeUtc", header: "End Time", minWidth: 80, maxWidth: 200 }
                ]}
                sortColumnFieldName="createdUtc"
                sortDescending={true}
            />
        </>
        );
    }

    protected readonly getData = async () => {
        const [runs, allowCreateExp] = await Promise.all([this.services.runHistoryService.getRunList(), this.services.accessService.checkPermission()]);

        if (!runs || allowCreateExp === undefined) {
            return;
        }
        const runHistoryChartData = processRunHistoryChart(runs);
        const uniqExperimentNames = this.getUniqExperimentNames(runs);
        const originRunStatistics = countBy(runs, (run) => run && run.status);
        const runStatistics = mergeRunStatus(originRunStatistics);
        if (allowCreateExp) {
            const startRunButton = this.navigationBarButtons.find((b) => b.key === "startRun");
            if (startRunButton) {
                startRunButton.disabled = false;
                this.refreshButtons();
            }
        }
        this.setState({ runs, uniqExperimentNames, runStatistics, runHistoryChartData }, this.handleDateExperimentChange);
    }
    private readonly startNewRun = () => {
        this.logUserAction("CreateExperiment");
        this.setState({
            redirectToStartRun: true
        });
    }

    private readonly renderRunId = (content: React.ReactNode, run: IRunDtoWithExperimentName) => {
        if (run.runId) {
            if (run.parentRunId) {
                return PageRedirectLink(content, ChildRun, { runId: run.runId, experimentName: run.experimentName });
            }
            else {
                return PageRedirectLink(content, ParentRun, { runId: run.runId, experimentName: run.experimentName });
            }
        }
        return undefined;
    }

    private readonly getUniqExperimentNames = (runs: IRunDtoWithExperimentName[]) => {
        const allExperimentNames = map(runs, (run) => run.experimentName);
        const uniqExperimentNames = uniq(allExperimentNames);
        uniqExperimentNames.sort();
        return uniqExperimentNames;
    }

    private readonly handleDateFilterChange = (startDate: Date | undefined) => {
        this.logUserAction("DateFilter", {
            DateFilterValue: startDate && moment(startDate)
                .utc()
                .toString()
        });
        this.setState({ dateFilter: startDate },
            this.handleDateExperimentChange);
    }

    private readonly handleExperimentFilterChange = (experimentFilter: string[] | undefined) => {
        this.logUserAction("ExperimentFilter", { ExperimentFilterValue: JSON.stringify(experimentFilter) });
        this.setState({ experimentFilter }, this.handleDateExperimentChange);
    }

    private readonly handleStatusFilterChange = (statusFilter: string | undefined) => {
        this.logUserAction("StatusFilter", { StatusFilterValue: statusFilter });
        this.setState({ statusFilter }, this.updateByStatusFilter);
    }

    private readonly updateRunListStatistic = () => {
        if (this.state.runs) {
            const filteredByDateExperimentRuns = this.state.runs.filter((run) =>
                this.filterRunByDate(run)
                && this.filterRunByExperiments(run));
            const originRunStatistics = countBy(filteredByDateExperimentRuns, (run) => run && run.status);
            const runStatistics = mergeRunStatus(originRunStatistics);
            this.setState({ runStatistics });
        }
    }

    private readonly updateByStatusFilter = () => {
        if (this.state.runs) {
            const filteredRuns = this.state.runs.filter((run) =>
                this.filterRunByDate(run)
                && this.filterRunByExperiments(run)
                && this.filterRunByStatus(run));
            const runHistoryChartData = processRunHistoryChart(filteredRuns);
            this.setState({ filteredRuns, runHistoryChartData });
        }
    }

    private readonly handleDateExperimentChange = async () => {
        this.updateRunListStatistic();
        this.updateByStatusFilter();
    }

    private readonly filterRunByDate = (run: IRunDtoWithExperimentName | undefined) => {
        if (!run || !this.state || !this.state.dateFilter) {
            return true;
        }
        return run.createdUtc && run.createdUtc >= this.state.dateFilter;
    }

    private readonly filterRunByExperiments = (run: IRunDtoWithExperimentName | undefined) => {
        if (!run || !this.state || !this.state.experimentFilter) {
            return true;
        }
        return includes(this.state.experimentFilter, run.experimentName);
    }

    private readonly filterRunByStatus = (run: IRunDtoWithExperimentName | undefined) => {
        if (!run || !this.state || !this.state.statusFilter) {
            return true;
        }
        return run.status && this.state.statusFilter === statusMapping[run.status];
    }
}
