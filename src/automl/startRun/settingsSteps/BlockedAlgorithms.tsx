import * as React from "react";
import { FormCheckList } from "../../components/Form/FormCheckList";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { Algorithms } from "../../services/constants/Algorithms";
import { RunType } from "../../services/constants/RunType";
import { ISettingsStepParams } from "./ISettingsStepParams";

export interface IBlockedAlgorithmsProps {
    jobType: RunType;
}

interface IBlockedAlgorithmsState {
    algorithms: string[];
}

export class BlockedAlgorithms extends React.Component<IBlockedAlgorithmsProps, IBlockedAlgorithmsState> {

    constructor(props: IBlockedAlgorithmsProps) {
        super(props);
        this.state = {
            algorithms: this.getAlgorithms()
        };
    }

    public componentDidUpdate(prevProps: IBlockedAlgorithmsProps): void {
        if (prevProps.jobType !== this.props.jobType) {
            this.setState({ algorithms: this.getAlgorithms() });
        }
    }

    public render(): React.ReactNode {
        return <>
            <LabelWithCallout required={true} htmlFor={undefined} labelText="Blocked Algorithms">
                Select algorithms to exclude
            </LabelWithCallout>
            <FormCheckList<ISettingsStepParams, "blacklistAlgos">
                field="blacklistAlgos"
                items={this.state.algorithms}
                validators={[this.validateSelection]}
            />
        </>;
    }

    private readonly validateSelection = (value: string[] | undefined) => {
        if (value && value.length === this.state.algorithms.length) {
            return "Must allow at least one algorithm";
        }
        return undefined;
    }

    private readonly getAlgorithms = (): string[] => {
        switch (this.props.jobType) {
            case "classification":
                return Algorithms.classification;
            case "regression":
                return Algorithms.regression;
            default:
                return Algorithms.regression;
        }
    }
}
