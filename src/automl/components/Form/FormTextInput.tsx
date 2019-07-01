import { ITextFieldProps, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { FormBaseInput } from "./FormBaseInput";

export class FormTextInput<
    TData extends { [key in TField]: string | undefined },
    TField extends keyof TData
    > extends FormBaseInput<TData, TField, string | undefined, ITextFieldProps>{
    public render(): React.ReactNode {
        return <TextField
            {...this.props}
            value={this.state.value}
            onChange={this._onChange}
            errorMessage={this.state.errorMessage}
        />;
    }

    private readonly _onChange = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string): void => {
        this.setValue(value);
    }
}
