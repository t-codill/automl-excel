import { isEqual } from "lodash";
import { IBasePicker, ITag, ITagItemProps, ITagPickerProps, TagItem } from "office-ui-fabric-react";
import * as React from "react";
import { Omit } from "../../common/Omit";
import { TagPicker } from "../Base/TagPicker";
import { FormBaseInput } from "./FormBaseInput";
import { ValidationError } from "./ValidationError";

import "./FormTagPicker.scss";

export interface IFormTagPickerProps extends Omit<ITagPickerProps, "onResolveSuggestions"
  | "defaultSelectedItems"> {
  items: string[];
  placeholder?: string;
  id?: string;
}

export class FormTagPicker<
  TData extends { [key in TField]: string[] },
  TField extends keyof TData
  > extends FormBaseInput<TData, TField, string[], IFormTagPickerProps>{
  private readonly tagPicker = React.createRef<IBasePicker<ITag>>();

  public componentDidUpdate(prevProps: IFormTagPickerProps): void {
    if (!isEqual(prevProps.items, this.props.items)) {
      this.setState({ value: [] });
    }
  }

  public render(): React.ReactNode {
    return <>
      <TagPicker
        className={this.state.errorMessage ? "tag-container" : ""}
        componentRef={this.tagPicker}
        onResolveSuggestions={this._onResolveSuggestions}
        selectedItems={this.getTags(this.state.value)}
        onRenderItem={this._onRenderTag}
        inputProps={{
          placeholder: this.props.placeholder,
          id: this.props.id
        }}
        onChange={this._onChange}
        onEmptyInputFocus={this._onEmptyInputFocus}
        styles={{
          text:
          {
            maxHeight: 25,
            minHeight: 25,
            margin: 0
          },
          input:
          {
            fontSize: 12,
            fontStyle: "italic",
            fontFamily: "inherit",
            height: 25
          }
        }}
      />
      <ValidationError text={this.state.errorMessage} />
    </>;
  }

  private readonly getTags = (values: string[] | undefined): ITag[] => {
    if (!values) {
      return [];
    }
    return values.map((i) => ({ name: i, key: i }));
  }

  private readonly _onEmptyInputFocus = (selectedItems: ITag[] | undefined): ITag[] => {
    return this.getSuggestions("", selectedItems);
  }

  private readonly _onResolveSuggestions = (filter: string, selectedItems?: ITag[] | undefined): ITag[] => {
    return this.getSuggestions(filter, selectedItems);
  }

  private readonly _onChange = (items?: ITag[]): void => {
    if (!items) {
      this.setValue([]);
      return;
    }
    this.setValue(items.map((i) => i.key));
  }

  private readonly _onRenderTag = (props: ITagItemProps): JSX.Element => {
    props.styles = {
      root: {
        minHeight: 18,
        maxHeight: 18,
        lineHeight: 18,
        margin: 1
      }
    };
    return <TagItem {...props}> {props.item.name}</TagItem >;
  }

  private readonly getSuggestions = (filter: string, selectedItems: ITag[] | undefined) => {
    let items = [...this.props.items];
    if (filter) {
      items = items.filter((i) => i
        .toLowerCase()
        .indexOf(filter.toLowerCase()) >= 0);
    }
    if (selectedItems) {
      const selected = new Set(selectedItems.map((s) => s.key));
      items = items.filter((i) => !selected.has(i));
    }
    return this.getTags(items);
  }
}
