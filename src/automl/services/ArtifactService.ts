import { ArtifactAPI, ArtifactAPIModels } from "@vienna/artifact";
import { v4 as uuid4 } from "uuid";
import { blob2string } from "../common/utils/blob2string";
import { getServiceCommonUrl } from "../common/utils/getServiceCommonUrl";
import { isRunCompleted } from "../common/utils/run";
import { ArtifactServicePath } from "./constants/ArtifactServicePath";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

const artifactClientApiVersion = "1.0";
const runOrigin = "ExperimentRun";

export interface IArtifact {
    origin: string;
    container: string;
    path: string;
}

export interface IRunDataForArtifact {
    runId: string | undefined;
    parentRunId: string | undefined;
    status: string | undefined;
}

async function getArtifactContent(artifact: ArtifactAPIModels.GetArtifactContentByIdResponse): Promise<string | undefined> {
    const blobBody = await artifact.blobBody;
    if (blobBody) {
        return blob2string(blobBody);
    }
    return undefined;
}

function getContentUri(res: ArtifactAPIModels.ArtifactContentInformationDto | null): string | undefined {
    return res ? res.contentUri : undefined;
}

export class ArtifactService extends ServiceBaseNonArm<ArtifactAPI> {

    constructor(props: IServiceBaseProps) {
        super(props, ArtifactAPI, props.discoverUrls.history);
    }

    public async tryGetContentForRun(runId: string, path: string): Promise<string | null | undefined> {
        return this.tryGetContent({ origin: runOrigin, container: runId, path });
    }

    public async tryGetContent(artifact: IArtifact): Promise<string | null | undefined> {
        return this.trySend(async (client, abortSignal) => {
            const artifactContent = await client.getArtifactContentById2(
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                artifact.origin,
                artifact.container,
                artifactClientApiVersion, {
                    path: artifact.path,
                    abortSignal
                });
            return getArtifactContent(artifactContent);
        });
    }

    public async getContent(artifact: IArtifact): Promise<string | undefined> {
        return this.send(async (client, abortSignal) => {
            const artifactContent = await client.getArtifactContentById2(
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                artifact.origin,
                artifact.container,
                artifactClientApiVersion, {
                    path: artifact.path,
                    abortSignal
                });
            return getArtifactContent(artifactContent);
        });
    }

    public async getAllContents(params: IArtifact[]): Promise<Array<string | undefined> | undefined> {
        return this.parallelGetAllValues(params, async (param, client, abortSignal) => {
            const artifact = await client.getArtifactContentById2(
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                param.origin,
                param.container,
                artifactClientApiVersion, {
                    path: param.path,
                    abortSignal
                });
            return getArtifactContent(artifact);
        });
    }

    public async getAllArtifactsForRuns(runs: string[]): Promise<ArtifactAPIModels.ArtifactDto[][] | undefined> {
        return this.parallelGetAllValuesWithContinuationToken(runs, async (runId, client, abortSignal, continuationToken) => {
            return client.getArtifactsInContainerOrPath2(
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                runOrigin,
                runId,
                artifactClientApiVersion, {
                    abortSignal,
                    continuationToken
                });
        });
    }

    public async getAllArtifacts(runId: string): Promise<ArtifactAPIModels.ArtifactDto[] | undefined> {
        return this.getAllValuesWithContinuationToken(async (client, abortSignal, continuationToken) => {
            return client.getArtifactsInContainerOrPath2(
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                runOrigin,
                runId,
                artifactClientApiVersion, {
                    abortSignal,
                    continuationToken
                });
        });
    }

    public async tryGetArtifactContentInfo(artifact: IArtifact): Promise<ArtifactAPIModels.GetArtifactContentInformation2Response | null | undefined> {
        return this.trySend(async (client, abortSignal) => {
            return client.getArtifactContentInformation2(
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                artifact.origin,
                artifact.container,
                artifactClientApiVersion, {
                    abortSignal,
                    path: artifact.path
                });
        });
    }

    public async getModelUri(run: IRunDataForArtifact): Promise<string | null | undefined> {
        if (!run || !run.runId || !run.parentRunId || !isRunCompleted(run)) {
            return null;
        }
        const container = run.runId;
        const result = await this.trySend(
            async (client, abortSignal) => {
                return client.getArtifactContentInformation2(
                    this.props.subscriptionId,
                    this.props.resourceGroupName,
                    this.props.workspaceName,
                    runOrigin,
                    container,
                    artifactClientApiVersion, {
                        abortSignal,
                        path: ArtifactServicePath.Model
                    });
            });
        if (result === undefined) {
            return undefined;
        }
        if (!result || !result.contentUri) {
            return null;
        }
        return result.contentUri;
    }

    public async getDeployUri(run: IRunDataForArtifact): Promise<{
        modelUri?: string;
        condaUri?: string;
        scoringUri?: string;
    } | undefined> {
        if (!run || !run.runId || !run.parentRunId || !isRunCompleted(run)) {
            return {};
        }
        const container = run.runId;
        const result = await this.parallelTryGetAllValues(
            [
                ArtifactServicePath.Model,
                ArtifactServicePath.Conda,
                ArtifactServicePath.Scoring
            ],
            async (path, client, abortSignal) => {
                return client.getArtifactContentInformation2(
                    this.props.subscriptionId,
                    this.props.resourceGroupName,
                    this.props.workspaceName,
                    runOrigin,
                    container,
                    artifactClientApiVersion, {
                        abortSignal,
                        path
                    });
            });
        if (!result) {
            return undefined;
        }
        return {
            modelUri: getContentUri(result[0]),
            condaUri: getContentUri(result[1]),
            scoringUri: getContentUri(result[2])
        };
    }

    public async uploadArtifact(container: string, path: string, content: string): Promise<string | undefined> {
        return this.send(async (_client, abortSignal) => {
            const baseUrl = this.geBaseUrl();
            const artifactId = `${runOrigin}/${container}/${path}`;
            const url = `${baseUrl}/artifacts/content/${artifactId}?allowOverwrite=true`;
            const response = await window.fetch(new Request(url, {
                method: "POST",
                signal: abortSignal,
                body: new Blob([content]),
                headers: {
                    authorization: `Bearer ${this.props.getToken()}`,
                    "content-type": "application/octet-stream",
                    "x-ms-client-user-type": "AutoML WebUser",
                    "x-ms-client-request-id": uuid4(),
                    "x-ms-client-session-id": this.props.logger.getSessionId()
                }
            }));
            if (response.status === 200) {
                return artifactId;
            }
            return undefined;
        });
    }

    private geBaseUrl(): string {
        const prefix = `${this.props.discoverUrls.api}/artifact/v2.0`;
        const commonUrl = getServiceCommonUrl(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName);
        return `${prefix}${commonUrl}`;
    }
}
