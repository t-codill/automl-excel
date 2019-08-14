import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { CompoundButton } from "office-ui-fabric-react";
import * as React from "react";
import { PageNames } from "../../common/PageNames";
import { ModelDeployPanel } from "./ModelDeployPanel";

export interface IModelDeployProps {
    pageName: PageNames;
    experimentName: string | undefined;
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
    modelUri: string | undefined;
    scoringUri: string | undefined | null;
    condaUri: string | undefined | null;
    modelName: string | undefined;
    onModelDeploy(operationId: string): void;
}

export interface IModelDeployState {
    showDeployPanel: boolean;
}

export class ModelDeploy extends React.Component<IModelDeployProps, IModelDeployState, {}> {
    constructor(props: IModelDeployProps) {
        super(props);
        this.state = {
            showDeployPanel: false
        };
    }
    public readonly render = (): React.ReactNode => {
        const style: React.CSSProperties = {
            boxSizing: "border-box",
            height: "80px",
            width: "48%",
        };
        return <>
            <CompoundButton
                style={style}
                primary={true}
                secondaryText={this.props.modelName}
                disabled={!this.props.modelUri}
                onClick={this.onModelDeployClick}>
                {this.props.pageName === PageNames.ParentRun ? "Deploy Best Model" : "Deploy Model"}
            </CompoundButton>
            {this.state.showDeployPanel &&
                <ModelDeployPanel
                    {...this.props}
                    onCancel={this.onModelDeployCancel}
                    onModelDeploy={this.onModelDeploy}
                />
            }
        </>;
    }

    private readonly onModelDeployClick = () => {
        this.setState({ showDeployPanel: true });
    }
    private readonly onModelDeploy = (operationId: string) => {
        this.setState({ showDeployPanel: false });
        this.props.onModelDeploy(operationId);
    }
    private readonly onModelDeployCancel = () => {
        this.setState({ showDeployPanel: false });
    }
}
