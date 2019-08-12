import { RunHistoryAPIs, RunHistoryAPIsModels } from "@vienna/runhistory";

import { flatMap, mergeWith, reduce, sortBy } from "lodash";
import { BasicTypes } from "../common/BasicTypes";
import { IDictionary } from "../common/IDictionary";
import { isRunCompleted } from "../common/utils/run";
import { safeParseJson } from "../common/utils/safeParseJson";
import { IArtifact } from "./ArtifactService";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

const artifactLocationRegV1 = /^aml:\/\/artifactId\/([^/]+)\/([^/]+)\/outputs\/(.*)$/;
const artifactLocationRegV2 = /^aml:\/\/artifactId\/([^/]+)\/([^/]+)\/(.*)$/;
export type IRunDtoWithExperimentName = RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto & { experimentName: string };
export type RunMetricType = BasicTypes | BasicTypes[] | IDictionary<BasicTypes[]>;

function getMetricValue(metric: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunMetricDto): RunMetricType {
    if (!metric.cells
        || !metric.schema
        || !metric.schema.properties
        || !metric.schema.properties[0]
        || !metric.schema.properties[0].name) {
        return undefined;
    }
    if (metric.schema.properties.length === 1) {
        const propertyName = metric.schema.properties[0].name;
        // scalar
        if (metric.cells.length === 1) {
            return metric.cells[0][propertyName];
        }
        // array
        else {
            return metric.cells.map((c) => c[propertyName]);
        }
    }
    else {
        // create value from property: {property1: [], property2:[]}
        const tableValue: IDictionary<BasicTypes[]> = reduce<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsMetricSchemaPropertyDto, {}>(
            metric.schema.properties, (result, value) => {
                if (value.name) {
                    result[value.name] = [];
                }
                return result;
            }, {});
        return reduce<RunMetricType, {}>(metric.cells, (result, value) => {
            // push cells value to result
            // cell: {property1: 13}, result: {property1: [1], property2:[5]}
            // return {property1: [1,13], property2:[5]}
            mergeWith(result, value, (r, v) => {
                return [...r, v];
            });
            return result;
        }, tableValue);
    }
}
export class RunHistoryService extends ServiceBaseNonArm<RunHistoryAPIs> {
    constructor(props: IServiceBaseProps) {
        super(props, RunHistoryAPIs, props.discoverUrls.history);
    }
    public getArtifactBackedMetricNames(metrics: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunMetricDto[]): Array<[string, IArtifact]> {
        return reduce(metrics, (result, m) => {
            if (m.metricType) {
                let artifactLocationReg: RegExp;
                switch (m.metricType) {
                    case "azureml.v1.residuals":
                    case "azureml.v1.predictions":
                    case "azureml.v1.confusion_matrix":
                    case "azureml.v1.accuracy_table":
                        artifactLocationReg = artifactLocationRegV1;
                        break;
                    case "azureml.v2.residuals":
                    case "azureml.v2.predictions":
                    case "azureml.v2.confusion_matrix":
                    case "azureml.v2.accuracy_table":
                        artifactLocationReg = artifactLocationRegV2;
                        break;
                    default:
                        return result;
                }
                const match = artifactLocationReg.exec(m.dataLocation || "");
                if (match && m.name) {
                    result.push(
                        [
                            m.name,
                            {
                                origin: match[1],
                                container: match[2],
                                path: match[3]
                            }
                        ]);
                }
            }
            return result;
        }, [] as Array<[string, IArtifact]>);
    }
    public mergeMetrics(
        metrics: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunMetricDto[],
        artifactBackedMetricNames: string[],
        artifacts: Array<string | undefined>): IDictionary<RunMetricType> {
        return reduce<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunMetricDto, IDictionary<RunMetricType>>(metrics, (result, m) => {
            if (m.name) {
                const index = artifactBackedMetricNames.indexOf(m.name);
                result[m.name] = (index >= 0 && artifacts[index])
                    ? safeParseJson(artifacts[index])
                    : getMetricValue(m);
            }
            return result;
        }, {});

    }

    public async getExperiment(experimentName: string): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsExperimentDto | undefined> {

        return this.send(async (client, abortSignal) => {
            return client.getExperiment(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experimentName, {
                abortSignal
            });
        });
    }

    public async getRun(runId: string, experimentName: string): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.getRunDetails(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experimentName, runId, {
                abortSignal
            });
        });
    }

    public async getRunMetrics(runId: string, experimentName: string): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunMetricDto[] | undefined> {
        return this.getAllValuesWithContinuationToken(async (client, abortSignal, continuationtoken) => {
            return client.getRunMetrics(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experimentName, {
                abortSignal,
                continuationtoken,
                filter: `RunId eq '${runId}'`
            });
        });
    }

    public async getChildRuns(runId: string, experimentName: string): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto[] | undefined> {
        const runs = await this.getAllValuesWithContinuationToken(async (client, abortSignal, continuationtoken) => {
            return client.getChildRuns(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experimentName, runId,
                {
                    abortSignal,
                    continuationtoken
                });
        });
        if (!runs) {
            return undefined;
        }
        return sortBy(runs, (run) => run.properties ? parseInt(run.properties.iteration, 10) : undefined);
    }

    public async getChildRunMetrics(
        childRuns: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto[],
        metricsNames: string[],
        experimentName: string): Promise<Array<IDictionary<RunMetricType>> | undefined> {

        if (childRuns.length === 0) {
            return [];
        }

        const completedRuns = childRuns
            .filter(isRunCompleted);
        if (completedRuns.length < 1) {
            return childRuns.map(() => this.mergeMetrics([], [], []));
        }

        const metrics = await this.getAllValuesWithContinuationToken(async (client, abortSignal, continuationToken) => {
            return client.queryRunMetrics(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experimentName, {
                abortSignal,
                queryParams: {
                    filter: `(${
                        completedRuns
                            .map((run) => `RunId eq '${run.runId}'`)
                            .join(" or ")
                        }) and (${
                        metricsNames.map((name) => `name eq '${name}'`)
                            .join(" or ")
                        })`,
                    continuationToken,
                    top: 1000
                }
            });
        });
        if (!metrics) { return undefined; }

        return childRuns.map((run) => this.mergeMetrics(metrics.filter((m) => m.runId === run.runId), [], []));
    }

    public async listExperiments(): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsExperimentDto[] | undefined> {
        return this.getAllValuesWithContinuationToken(async (client, abortSignal, continuationtoken) => {
            return client.getExperiments(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                abortSignal,
                continuationtoken
            });
        });
    }

    // TODO: This is a temporary function only used by UX-Runner
    // This will be removed after we expose ODATA filter for getRunList
    public async getRuns(experiment: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsExperimentDto): Promise<IRunDtoWithExperimentName[] | undefined> {
        const allRuns = await this.getAllValuesWithContinuationToken(async (client, abortSignal, continuationtoken) => {
            return client.getRuns(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experiment.name || "",
                {
                    abortSignal,
                    continuationtoken,
                    filter: `Hidden eq false and parentRunId eq null and runType eq "automl"`,
                    top: 1000
                });
        });
        if (!allRuns) {
            return undefined;
        }

        return allRuns.map(
            ((run) => (
                {
                    ...run,
                    experimentName: experiment.name || ""
                })));
    }

    public async getRunList(): Promise<IRunDtoWithExperimentName[] | undefined> {
        const allExperiments = await this.listExperiments();
        if (!allExperiments) {
            return undefined;
        }
        const allRuns = await this.parallelGetAllValuesWithContinuationToken(allExperiments, async (exp, client, abortSignal, continuationtoken) => {
            return client.getRuns(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, exp.name || "",
                {
                    abortSignal,
                    continuationtoken,
                    filter: `Hidden eq false and parentRunId eq null and runType eq "automl"`,
                    top: 1000
                });
        });
        if (!allRuns) {
            return undefined;
        }

        return flatMap(
            allRuns.map(
                (com, idx) =>
                    com.map((run) => (
                        {
                            ...run,
                            experimentName: allExperiments[idx].name || ""
                        }))));
    }

    public async updateTag(
        run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto,
        experimentName: string,
        name: string,
        value: string
    ): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined> {
        return this.send(async (client, abortSignal) => {
            if (!run.runId) {
                return undefined;
            }
            const tags = { ...run.tags };
            tags[name] = value;
            return client.addOrModifyRun(
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                experimentName,
                run.runId,
                {
                    createRunDto: {
                        runId: run.runId,
                        tags
                    },
                    abortSignal
                });
        });
    }

    public async updateTags(
        run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto,
        experimentName: string,
        names: string[],
        values: string[]
    ): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined> {
        if (!names || !values || names.length !== values.length) {
            return undefined;
        }
        return this.send(async (client, abortSignal) => {
            if (!run.runId) {
                return undefined;
            }
            const tags = { ...run.tags };
            for (let i = 0; i < names.length; i++) {
                tags[names[i]] = values[i];
            }
            return client.addOrModifyRun(
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                experimentName,
                run.runId,
                {
                    createRunDto: {
                        runId: run.runId,
                        tags
                    },
                    abortSignal
                });
        });
    }
}
