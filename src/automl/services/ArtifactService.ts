import { ArtifactAPI, ArtifactAPIModels } from "@vienna/artifact";
import { blob2string } from "../common/utils/blob2string";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

const artifactClientApiVersion = "1.0";
const runOrigin = "ExperimentRun";
const modelPath = "outputs/model.pkl";

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

    public async tryGetArtifactUrl(artifact: IArtifact): Promise<ArtifactAPIModels.GetArtifactContentInformation2Response | null | undefined> {
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

    public async getModelUrl(run: IRunDataForArtifact): Promise<string | null | undefined> {
        if (!run || !run.runId || !run.parentRunId || run.status !== "Completed") {
            return null;
        }
        const result = await this.tryGetArtifactUrl({ container: run.runId, origin: runOrigin, path: modelPath });
        if (result === undefined) {
            return undefined;
        }
        if (!result || !result.contentUri) {
            return null;
        }
        return result.contentUri;
    }
}
