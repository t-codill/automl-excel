import * as React from "react";
import { FormContext } from "../FormContext";

export abstract class FormBaseInput
    extends React.Component<{ defaultFormValue: object }, { value: object | undefined; errorMessage: undefined }> {
    public static contextType = FormContext;
    public context!: React.ContextType<typeof FormContext>;

    constructor(props: { defaultFormValue: object }) {
        super(props);
        this.state = {
            value: props.defaultFormValue,
            errorMessage: undefined
        };
    }

    public componentDidMount(): void {
        return;
    }

    public componentWillUnmount(): void {
        return;
    }

    public validate = () => {
        return;
    }

    public getValue = () => {
        return this.state.value;
    }

    protected setValue = (value: object) => {
        this.setState({
            value
        });
    }
}
