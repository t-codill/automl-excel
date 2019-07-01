import * as React from "react";
import { CrossValidationNumberInput } from "./CrossValidationNumberInput";
import { PercentageValidationInput } from "./PercentageValidationInput";

export class MonteCarloInput extends React.Component {
    public render(): React.ReactNode {
        return <>
            <CrossValidationNumberInput />
            <PercentageValidationInput />
        </>;
    }
}
