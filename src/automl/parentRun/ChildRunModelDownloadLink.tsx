import { Icon, Link, Spinner, SpinnerSize } from "office-ui-fabric-react";
import * as React from "react";
import { download } from "../common/utils/download";
import { BaseComponent } from "../components/Base/BaseComponent";
import { ArtifactService, IRunDataForArtifact } from "../services/ArtifactService";

interface IChildRunModelDownloadLinkProps {
    run: IRunDataForArtifact;
}

export class ChildRunModelDownloadLink extends BaseComponent<
    IChildRunModelDownloadLinkProps,
    {
        downloading: boolean;
    },
    { artifactService: ArtifactService }
    > {
    protected readonly serviceConstructors = { artifactService: ArtifactService };
    protected getData?: (() => Promise<void>) | undefined;
    constructor(props: IChildRunModelDownloadLinkProps) {
        super(props);
        this.state = {
            downloading: false
        };
    }
    public render(): React.ReactNode {
        if (this.props.run.status !== "Completed") {
            return <></>;
        }
        if (this.state.downloading) {
            return <Spinner size={SpinnerSize.small} />;
        }

        return <Link onClick={this.onClick}>
            <Icon iconName="Download" /> Download
        </Link>;
    }

    private readonly onClick = async () => {
        this.setState({ downloading: true });
        const uri = await this.services.artifactService.getModelUrl(this.props.run);
        if (uri === undefined) {
            return;
        }
        this.setState({ downloading: false });
        if (uri === null) {
            return;
        }
        this.logUserAction("ModelDownloadFromTable", { childRunId: this.props.run.runId });
        download(uri, "model.pkl");
    }
}
