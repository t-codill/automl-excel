import * as React from "react";
import { Omit } from "../../common/Omit";
import { FormContext } from "./FormContext";
import { FormDataType } from "./FormDataType";
import { validate } from "./validate";
import { IValidator } from "./Validators";
export type FormBaseInputProps<
    TData extends { [key in TField]: TValue },
    TField extends keyof TData,
    TValue extends FormDataType,
    TProps> = Omit<TProps,
        "value"
        | "defaultValue"
        | "errorMessage"
        | "onChange"
        | "onChanged"
        | "defaultChecked"
        | "defaultValues"
        | "text"
        | "selectedKey"
        | "selectedKeys"
        | "defaultSelectedKey"
        | "defaultSelectedKeys"
        | "allowFreeform"
        | "validators"> & IFormBaseInputProps<TData, TField, TValue>;
export interface IFormBaseInputProps<
    TData extends { [key in TField]: TValue },
    TField extends keyof TData,
    TValue extends FormDataType
    > {
    field: TField;
    validators?: Array<IValidator<TValue>>;
    defaultFormValue?: TValue;
}
export interface IFormBaseInputStates<
    TData extends { [key in TField]: TValue },
    TField extends keyof TData,
    TValue extends FormDataType
    > {
    value: TValue;
    errorMessage: string | undefined;
}

export abstract class FormBaseInput<
    TData extends { [key in TField]: TValue },
    TField extends keyof TData,
    TValue extends FormDataType,
    TProps = {}
    >
    extends React.PureComponent<
    FormBaseInputProps<TData, TField, TValue, TProps>,
    IFormBaseInputStates<TData, TField, TValue>
    > {
    public static contextType = FormContext;

    public context!: React.ContextType<typeof FormContext>;

    constructor(props: FormBaseInputProps<TData, TField, TValue, TProps>) {
        super(props);
        this.state = {
            value: props.defaultFormValue as TValue,
            errorMessage: undefined
        };
    }

    public componentDidUpdate(prevProps: FormBaseInputProps<TData, TField, TValue, TProps>): void {
        if (prevProps.defaultFormValue !== this.props.defaultFormValue) {
            this.setState({ value: this.props.defaultFormValue as TValue });
        }
    }

    public componentDidMount(): void {
        this.context.mount(this);
    }

    public componentWillUnmount(): void {
        this.context.unmount(this);
    }

    public validate = () => {
        const error = validate<TValue>(this.state.value, this.props.validators);
        this.setState({ errorMessage: error });
        return error;
    }

    public getValue = (): TValue => {
        return this.state.value;
    }

    protected setValue(value: TValue): void {
        this.setState({
            value
        }, () => {
            if (this.context.onUpdated) {
                this.context.onUpdated(this.props.field, value);
            }
            this.validate();
        });
    }
}
