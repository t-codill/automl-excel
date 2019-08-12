import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ICreateComputeParams } from "./ICreateComputeParams";

const minNodeInput: React.FunctionComponent = () => {
    return <>
        <LabelWithCallout required={true} htmlFor={"minNode"} labelText="Minimum number of nodes">
            Using 0 (Zero) as minimal number of nodes will enable the compute to have no allocation
             and therefore no cost when not in use, however data profiling will not work on such
             compute since it takes time to profile the data. To enable data profiling the minimal
              number of nodes must be at least 1.
        </LabelWithCallout>
        <FormTextInput<ICreateComputeParams, "minNodeCount">
            field="minNodeCount"
            placeholder="Min node"
            ariaLabel="Please enter min node count of AML compute, leave 0 will allow system to recycle all node after train finished to avoid charge"
            validators={
                [
                    Validators.required("Min node is required"),
                    Validators.isInteger("Min node must be an integer"),
                    Validators.minValue(0, () => "Min node cannot be negative"),
                ]
            }
            defaultFormValue="0"
        />
    </>;
};

export { minNodeInput as MinNodeInput };
