import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { DefaultButton, Panel, PanelType, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { Accordion } from "../../components/Accordion/Accordion";
import { BaseComponent } from "../../components/Base/BaseComponent";
import { Form } from "../../components/Form/Form";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { PopupProgressIndicator } from "../../components/Progress/PopupProgressIndicator";
import { IVMSizeResult, WorkSpaceService } from "../../services/WorkSpaceService";
import { ICreateComputeParams } from "./ICreateComputeParams";
import { MaxNodeInput } from "./MaxNodeInput";
import { MinNodeInput } from "./MinNodeInput";
import { VmSizeSelector } from "./VmSizeSelector";

export interface IComputeCreatorProps {
    vmSizes: IVMSizeResult | undefined;
    onComputeCreated(compute: AzureMachineLearningWorkspacesModels.ComputeResource): void;
    onCancel(): void;
}

export interface IComputeCreatorState {
    creating: boolean;
    minNodeCount: string;
}

export class ComputeCreator extends BaseComponent<IComputeCreatorProps, IComputeCreatorState,
    {
        workSpaceService: WorkSpaceService;
    }> {
    protected readonly serviceConstructors = {
        workSpaceService: WorkSpaceService
    };

    protected readonly getData = undefined;

    constructor(props: IComputeCreatorProps) {
        super(props);
        this.state = {
            creating: false,
            minNodeCount: "0"
        };
    }

    public render(): React.ReactNode {
        return <>
            {!this.state.creating &&
                <Panel
                    isOpen={true}
                    type={PanelType.medium}
                    onDismiss={this.cancel}
                    isHiddenOnDismiss={true}
                    headerText="Create a New Compute"
                    closeButtonAriaLabel="Close"
                >
                    <Form onSubmit={this.createCompute} onUpdated={this.onFormUpdated}>
                        <FormTextInput<ICreateComputeParams, "name">
                            field="name"
                            required={true}
                            label="Compute name"
                            placeholder="Compute name"
                            ariaLabel="Please enter compute name here"
                            validators={[
                                Validators.required("Compute name is required"),
                                Validators.regex(/^[a-zA-Z][a-zA-Z0-9-]{1,15}$/,
                                    "Compute name should start with a letter, be between 2 and 16 character, and only include letters (a-zA-Z), numbers (0-9) and '-'")]}
                        />
                        <VmSizeSelector vmSizes={this.props.vmSizes} />
                        <Accordion
                            exclusive={true}
                            items={[
                                {
                                    title: "Additional Settings",
                                    collapsed: true,
                                    disabled: false,
                                    element: <>
                                        <MinNodeInput />
                                        <MaxNodeInput minNodeCount={this.state.minNodeCount} />
                                    </>
                                }
                            ]} />
                        <div className="form-footer">
                            <DefaultButton text="Cancel" onClick={this.cancel} />
                            <PrimaryButton text="Create" type="submit" />
                        </div>
                    </Form>
                </Panel>
            }
            {this.state.creating &&
                <PopupProgressIndicator
                    title="Creating a new compute..."
                    description="Creating a new compute. This may take a couple minutes."
                />}
        </>;
    }

    private readonly onFormUpdated = (key: keyof ICreateComputeParams, value: ICreateComputeParams[keyof ICreateComputeParams]) => {
        if (!value) {
            return;
        }
        if (key === "minNodeCount") {
            this.setState({ minNodeCount: value });
        }
    }

    private readonly cancel = () => {
        this.props.onCancel();
    }

    private readonly createCompute = async (data: ICreateComputeParams) => {
        if (!data
            || !data.name
            || !data.vmSize
            || !data.minNodeCount
            || !data.maxNodeCount) {
            return;
        }

        this.setState({
            creating: true
        });
        this.logUserAction("CreateCompute", { data: JSON.stringify(data) });
        const compute = await this.services.workSpaceService.createCompute(
            data.name,
            data.vmSize,
            parseInt(data.minNodeCount, 10),
            parseInt(data.maxNodeCount, 10)
        );

        this.setState({ creating: false });

        if (!compute) {
            return;
        }

        this.props.onComputeCreated(compute);
    }
}
