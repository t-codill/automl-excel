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
    modelId: string | undefined;
    modelName: string | undefined;
    onModelRegister(): void;
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
                    onModelRegister={this.props.onModelRegister}
                />
            }
        </>;
    }

    private readonly onModelDeployClick = () => {
        this.setState({ showDeployPanel: true });
    }
    private readonly onModelDeployCancel = () => {
        this.setState({ showDeployPanel: false });
    }
}
