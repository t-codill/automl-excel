import * as React from "react";
import "./ValidationError.scss";

export interface IValidationErrorProps {
    text: string | undefined;
}

export class ValidationError extends React.Component<IValidationErrorProps> {
    public render(): JSX.Element {
        return <div className="errorMessage">
            {this.props.text}
        </div>;
    }
}
