import * as React from "react";
import { Omit } from "../../common/Omit";
import { ComboBox, IProps } from "../../common/uiFabricWrappers/comboBox/ComboBox";
import { FormBaseInput } from "./FormBaseInput";

export class FormDropdown<
    TData extends { [key in TField]: string | undefined },
    TField extends keyof TData
    > extends FormBaseInput<TData, TField, string | undefined, Omit<IProps, "allowFreeform" | "onOptionSelection">>{
    public render(): React.ReactNode {
        return <ComboBox
            allowFreeform={false}
            onOptionSelection={this.onOptionsSelection}
            {...this.props}
            // These props cannot be overridden
            errorMessage={this.state.errorMessage}
            initialSelectedKey={this.state.value}
            comboBoxOptionStyles={{
                root:
                {
                    paddingTop: 0,
                    paddingBottom: 0,
                    minHeight: 20
                }
            }}
        />;
    }

    private readonly onOptionsSelection = (selected?: string) => {
        if (selected) {
            this.setValue(selected);
        }
    }
}
