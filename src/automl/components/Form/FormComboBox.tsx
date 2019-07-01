import * as React from "react";
import { Omit } from "../../common/Omit";
import { ComboBox, IProps } from "../../common/uiFabricWrappers/comboBox/ComboBox";
import { FormBaseInput } from "./FormBaseInput";
import "./FormComboBox.scss";

export class FormComboBox<
  TData extends { [key in TField]: string | undefined },
  TField extends keyof TData
  > extends FormBaseInput<TData, TField, string | undefined, Omit<IProps, "allowFreeform" | "onOptionSelection">> {
  public render(): JSX.Element {
    return (
      <ComboBox
        allowFreeform={true}
        onOptionSelection={this.onOptionsSelection}
        {...this.props}
        // These props cannot be overridden
        errorMessage={this.state.errorMessage}
        initialSelectedKey={this.state.value}
        text={this.state.value}
        comboBoxOptionStyles={{
          root:
          {
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: 20
          }
        }}
      />
    );
  }

  private readonly onOptionsSelection = (selected?: string) => {
    if (selected) {
      this.setValue(selected);
    }
  }
}
