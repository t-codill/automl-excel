import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { ICreateComputeParams } from "./ICreateComputeParams";

export interface IMaxNodeInputProps { minNodeCount: string | undefined; }
export class MaxNodeInput extends React.PureComponent<IMaxNodeInputProps> {
    public render(): React.ReactNode {
        return <FormTextInput<ICreateComputeParams, "maxNodeCount">
            field="maxNodeCount"
            required={true}
            label="Maximum number of nodes"
            placeholder="Max node"
            ariaLabel="Please enter max node count of AML compute"
            validators={
                [
                    Validators.required("Max node is required"),
                    Validators.isInteger("Max node must be an integer"),
                    this.minNodeValidate
                ]
            }
            defaultFormValue="6"
        />;
    }

    private readonly minNodeValidate = (value: string | undefined) => {
        if (!this.props.minNodeCount || !value) {
            return undefined;
        }
        if (parseInt(value, 10) < parseInt(this.props.minNodeCount, 10)) {
            return "Max Node must be greater than or equal to min node";
        }
        return undefined;
    }
}
