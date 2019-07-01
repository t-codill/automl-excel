import { Checkbox, ICheckboxProps } from "office-ui-fabric-react";
import * as React from "react";
import { FormBaseInput } from "./FormBaseInput";

export class FormCheckBox<
    TData extends { [key in TField]: boolean | undefined },
    TField extends keyof TData
    > extends FormBaseInput<TData, TField, boolean | undefined, ICheckboxProps>{
    public render(): React.ReactNode {
        return <Checkbox
            {...this.props}
            checked={this.state.value}
            onChange={this._onChange}
        />;
    }

    private readonly _onChange = (_?: React.FormEvent<HTMLElement | HTMLInputElement>, value?: boolean): void => {
        this.setValue(value);
    }
}
