import * as React from "react";
import { CheckList, ICheckListProps } from "../CheckList/CheckList";
import { FormBaseInput } from "./FormBaseInput";

export class FormCheckList<
  TData extends { [key in TField]: string[] },
  TField extends keyof TData
  > extends FormBaseInput<TData, TField, string[], ICheckListProps>{
  public render(): React.ReactNode {
    return (
      <CheckList
        items={[]}
        {...this.props}
        onChange={this._onChange}
        values={this.state.value}
        errorMessage={this.state.errorMessage}
      />
    );
  }

  private readonly _onChange = (value: string[]): void => {
    this.setValue(value);
  }
}
