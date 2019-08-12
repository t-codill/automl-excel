import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { classificationSuccessRun } from "../../childRun/__data__/classificationSuccessRun";
import { BasicTypes } from "../../common/BasicTypes";
import { IDictionary } from "../../common/IDictionary";
import { parentSuccessRun } from "../../parentRun/__data__/parentSuccessRun";
import { IArtifact } from "../ArtifactService";

export type IRunDtoWithExperimentName = RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto & { experimentName: string };
export type RunMetricType = BasicTypes | BasicTypes[] | IDictionary<BasicTypes[]>;

export class RunHistoryService {
    public getArtifactBackedMetricNames(): Array<[string, IArtifact]> {
        const artifact: IArtifact = {
            origin: "",
            container: "",
            path: ""
        };
        return [["artifact", artifact]];
    }
    public mergeMetrics(): IDictionary<RunMetricType> {
        if (classificationSuccessRun.runMetrics) {
            return classificationSuccessRun.runMetrics;
        }
        return {};
    }

    public async getExperiment(): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsExperimentDto | undefined> {
        return undefined;
    }

    public async getRun(): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined> {
        return classificationSuccessRun.run;
    }

    public async getRunMetrics(): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunMetricDto[] | undefined> {
        return [classificationSuccessRun.runMetrics];
    }

    public async getChildRuns(): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto[] | undefined> {
        return undefined;
    }

    public async getChildRunMetrics(): Promise<Array<IDictionary<RunMetricType>> | undefined | undefined> {
        return undefined;
    }

    public async listExperiments(): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsExperimentDto[] | undefined> {
        return [
            {
                createdUtc: new Date(2019, 1, 1, 1, 1, 1, 1),
                description: "Description 1",
                experimentId: "Experiment Id 1",
                name: "Experiment Name 1"
            },
            {
                createdUtc: new Date(2019, 2, 2, 2, 2, 2, 2),
                description: "Description 2",
                experimentId: "Experiment Id 2",
                name: "Experiment Name 2"
            },
            {}
        ];
    }

    public async getRunList(): Promise<IRunDtoWithExperimentName[] | undefined> {
        return [
            {
                experimentName: "experiment1",
                runId: "run1"
            },
            {
                experimentName: "experiment2",
                runId: "run2"
            }
        ];
    }

    public async updateTag(): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined> {
        return parentSuccessRun.run;
    }

    public async updateTags(): Promise<RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined> {
        return parentSuccessRun.run;
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
