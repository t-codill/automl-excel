import * as React from "react";
import { FormBaseInput } from "./FormBaseInput";
import { FormContext } from "./FormContext";
import { FormDataType } from "./FormDataType";

export interface IFormProps<TData extends { [key in keyof TData]: FormDataType }> {
    onSubmit(value: TData): void;
    onUpdated?(key: keyof TData, value: TData[keyof TData]): void;
}
export interface IFormStates<TData extends { [key in keyof TData]: FormDataType }> {
    onSubmit(value: TData): void;
}

export class Form<TData extends { [key in keyof TData]: FormDataType }> extends React.Component<IFormProps<TData>, IFormStates<TData>> {
    private readonly _inputs: Set<FormBaseInput<TData, keyof TData, TData[keyof TData]>> = new Set();
    public render(): React.ReactNode {
        return (
            <FormContext.Provider value={{
                mount: this._mount,
                unmount: this._unmount,
                onUpdated: this.props.onUpdated
            }}>
                <form
                    onSubmit={this._onSubmit}
                    noValidate={true}
                    autoComplete="off">
                    {this.props.children}
                </form>
            </FormContext.Provider>
        );

    }
    private readonly _mount = (input: FormBaseInput<TData, keyof TData, TData[keyof TData]>) => {
        this._inputs.add(input);
        return;
    }
    private readonly _unmount = (input: FormBaseInput<TData, keyof TData, TData[keyof TData]>) => {
        this._inputs.delete(input);
        return;
    }
    private readonly _onSubmit = (event: React.FormEvent<HTMLElement>): void => {
        event.preventDefault();
        const val: TData = Object.create(null);
        let valid = true;
        this._inputs.forEach((input) => {
            val[input.props.field] = input.getValue();
            valid = !input.validate() && valid;
        });
        if (valid) {
            this.props.onSubmit(val);
        }
    }
}
