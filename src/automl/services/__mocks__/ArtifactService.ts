import { ArtifactAPIModels } from "@vienna/artifact";

export interface IArtifact {
    origin: string;
    container: string;
    path: string;
}

export class ArtifactService {
    private readonly tryGetContentResult = "tryGetContent";
    private readonly getAllArtifactsResult: ArtifactAPIModels.ArtifactDto[] = [
        {
            artifactId: "artifactId1",
            container: "container1",
            origin: "origin1",
            path: "path1"
        },
        {
            artifactId: "artifactId2",
            container: "container2",
            origin: "origin2",
            path: "path2"
        }
    ];
    private readonly tryGetArtifactUrlResult: ArtifactAPIModels.ArtifactContentInformationDto = {
        contentUri: "contentUri",
        path: "path"
    };
    private readonly getModelUrlResult = "getModelUrl";
    private readonly getModelUrlsResult = ["getModelUrls1", "getModelUrls2"];

    public async tryGetContentForRun(): Promise<string | null | undefined> {
        return this.tryGetContentResult;
    }

    public async tryGetContent(): Promise<string | null | undefined> {
        return this.tryGetContentResult;
    }

    public async getContent(): Promise<string | null | undefined> {
        return this.tryGetContentResult;
    }

    public async getAllContents(params: IArtifact[]): Promise<Array<string | undefined> | undefined> {
        return params.map((p) => `"getAllContentsResult:${p.origin}/${p.container}/${p.path}`);
    }

    public async getAllArtifacts(): Promise<ArtifactAPIModels.ArtifactDto[] | undefined> {
        return this.getAllArtifactsResult;
    }

    public async getAllArtifactsForRuns(runs: string[]): Promise<ArtifactAPIModels.ArtifactDto[][] | undefined> {
        return runs.map(() => this.getAllArtifactsResult);
    }

    public async tryGetArtifactUrl(): Promise<ArtifactAPIModels.ArtifactContentInformationDto | null | undefined> {
        return this.tryGetArtifactUrlResult;
    }

    public async getModelUrl(): Promise<string | undefined> {
        return this.getModelUrlResult;
    }

    public async getModelUrls(): Promise<Array<string | null> | undefined> {
        return this.getModelUrlsResult;
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
