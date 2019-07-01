import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { CompoundButton } from "office-ui-fabric-react";
import * as React from "react";
import { PageNames } from "../../common/PageNames";
import { download } from "../../common/utils/download";
import { BaseComponent } from "../Base/BaseComponent";

export interface IModelDownloadProps {
    pageName: PageNames;
    experimentName: string | undefined;
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
    modelName: string | undefined;
    modelUri: string | undefined;
}

export class ModelDownload extends BaseComponent<IModelDownloadProps, {}, {}> {
    protected serviceConstructors = {};
    protected getData = undefined;
    public readonly render = (): React.ReactNode => {
        const style: React.CSSProperties = {
            boxSizing: "border-box",
            height: "80px",
            width: "48%",
        };
        return <CompoundButton
            style={style}
            secondaryText={this.props.modelName}
            disabled={!this.props.modelUri}
            onClick={this.downloadModel}>
            {this.props.pageName === PageNames.ParentRun ? "Download Best Model" : "Download Model"}
        </CompoundButton>;
    }
    private readonly downloadModel = () => {
        if (this.props.modelUri) {
            this.logUserAction("ModelDownloadFromButton",
                { modelUri: this.props.modelUri, experimentName: this.props.experimentName, runId: this.props.run && this.props.run.runId });
            download(this.props.modelUri, "model.pkl");
        }
    }
}
