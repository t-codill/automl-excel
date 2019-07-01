import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { map, uniq } from "lodash";
import { DefaultButton, Dialog, DialogFooter, DialogType, Icon, Link, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { BaseComponent } from "../../components/Base/BaseComponent";
import { Form } from "../../components/Form/Form";
import { RunHistoryService } from "../../services/RunHistoryService";
import { IVMSizeResult, WorkSpaceService } from "../../services/WorkSpaceService";
import { ComputeCreator } from "./ComputeCreator";
import { ComputeSelector } from "./ComputeSelector";
import { ExperimentNameInput } from "./ExperimentNameInput";

export interface IExperimentStepProps {
    experimentName: string | undefined;
    compute: AzureMachineLearningWorkspacesModels.ComputeResource | undefined;
    readOnly: boolean;
    onEditClick(): void;
    onCancel(): void;
    onNext(
        experimentName: string | undefined,
        compute: AzureMachineLearningWorkspacesModels.ComputeResource | undefined
    ): void;
}
export interface IExperimentStepCallback {
    experimentName: string | undefined;
    computeId: string | undefined;
}

export interface IExperimentStepState {
    experimentNames: string[] | undefined;
    computes: AzureMachineLearningWorkspacesModels.ComputeResource[] | undefined;
    selectedCompute: AzureMachineLearningWorkspacesModels.ComputeResource | undefined;
    showComputeCreator: boolean;
    vmSizes: IVMSizeResult | undefined;
    showCancelDialog: boolean;
    computeRefreshing: boolean;
}

export class ExperimentStep
    extends BaseComponent<IExperimentStepProps, IExperimentStepState, {
        workSpaceService: WorkSpaceService;
        runHistoryService: RunHistoryService;
    }> {
    protected readonly serviceConstructors = {
        workSpaceService: WorkSpaceService,
        runHistoryService: RunHistoryService
    };

    constructor(props: IExperimentStepProps) {
        super(props);
        this.state = {
            experimentNames: undefined,
            computes: undefined,
            selectedCompute: props.compute,
            showComputeCreator: false,
            vmSizes: undefined,
            showCancelDialog: false,
            computeRefreshing: false
        };
    }

    public render(): React.ReactNode {
        return <>
            <Form
                onSubmit={this.onSubmit}>
                <div className="start-run-step-content">
                    <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                        <ExperimentNameInput
                            experimentName={this.props.experimentName}
                            readonly={this.props.readOnly}
                            onEditClick={this.props.onEditClick}
                            experimentNames={this.state.experimentNames}
                        />
                    </div>
                    <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                        <ComputeSelector
                            computes={this.state.computes}
                            selectedComputeId={this.state.selectedCompute && this.state.selectedCompute.id}
                            readonly={this.props.readOnly}
                            refreshing={this.state.computeRefreshing}
                            onEditClick={this.props.onEditClick}
                        />
                        {!this.props.readOnly &&
                            <Link
                                id="linkCreateCompute"
                                onClick={this.onCreateComputeClick}>
                                <Icon iconName="Devices3" style={{ marginRight: 5 }} />
                                <span>Create a new compute</span>
                            </Link>
                        }
                        {!this.props.readOnly &&
                            <Link
                                id="linkRefreshCompute"
                                onClick={this.onRefreshComputeClick} >
                                <Icon iconName="Refresh" style={{ marginRight: 5, marginLeft: 15 }} />
                                <span>Refresh Compute</span>
                            </Link>
                        }
                    </div>
                </div>

                {!this.props.readOnly &&
                    <div className="form-footer">
                        <DefaultButton text="Cancel" onClick={this.showCancelDialog} />
                        <PrimaryButton type="submit" text="Next" />
                    </div>
                }
            </Form>

            {this.state.showComputeCreator &&
                <ComputeCreator
                    {...this.props}
                    {...this.state}
                    onComputeCreated={this.onComputeCreated}
                    onCancel={this.onComputeCreateCancel}
                />
            }
            <Dialog
                hidden={!this.state.showCancelDialog}
                onDismiss={this.closeCancelDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: "Cancel New Experiment?",
                    subText: `Are you sure you want to cancel creating a new Experiment?`
                }}
                modalProps={{
                    titleAriaId: "cancelDialogLabel",
                    subtitleAriaId: "cancelSubtextLabel",
                    isBlocking: false,
                    containerClassName: "ms-dialogMainOverride"
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={this.cancelRun} text="Yes" />
                    <DefaultButton onClick={this.closeCancelDialog} text="No" />
                </DialogFooter>
            </Dialog>
        </>;
    }

    protected readonly getData = async () => {
        this.getExperimentNames();
        this.getComputes();
        this.getVmSizes();
    }

    private readonly onCreateComputeClick = () => {
        this.setState({ showComputeCreator: true });
    }

    private readonly onRefreshComputeClick = () => {
        this.getComputes();
    }

    private readonly onComputeCreated = (compute: AzureMachineLearningWorkspacesModels.ComputeResource) => {
        this.setState({ showComputeCreator: false, selectedCompute: compute });
        this.getComputes();
    }

    private readonly onComputeCreateCancel = () => {
        this.setState({ showComputeCreator: false });
    }

    private readonly getExperimentNames = async (): Promise<void> => {
        const experiments = await this.services.runHistoryService.listExperiments();
        if (!experiments) {
            return;
        }
        const experimentNames = uniq(map(experiments, (experiment) => experiment.name || ""));
        this.setState({ experimentNames });
    }

    private readonly getComputes = async (): Promise<void> => {
        this.setState({ computeRefreshing: true });
        const computes = await this.services.workSpaceService.listComputes();
        if (!computes) {
            return;
        }
        this.setState({ computes, computeRefreshing: false });
    }

    private readonly getVmSizes = async (): Promise<void> => {
        const vmSizes = await this.services.workSpaceService.listVmSizes();
        if (!vmSizes) {
            return;
        }
        this.setState({ vmSizes });
    }

    private readonly onSubmit = (values: IExperimentStepCallback) => {
        if (!values.computeId || !this.state.computes) {
            return;
        }
        this.props.onNext(values.experimentName, this.state.computes.find((c) => c.id === values.computeId));
    }

    private readonly showCancelDialog = (): void => {
        this.setState({ showCancelDialog: true });
    }

    private readonly closeCancelDialog = (): void => {
        this.setState({ showCancelDialog: false });
    }

    private readonly cancelRun = () => {
        this.props.onCancel();
        this.closeCancelDialog();
    }

}
