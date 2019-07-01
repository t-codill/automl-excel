import { BasePicker, IBasePickerState, IBasePickerStyleProps, IBasePickerStyles, ITag, ITagItemProps, ITagPickerProps, styled, TagItem, TagItemSuggestion } from "office-ui-fabric-react";
// tslint:disable-next-line:no-submodule-imports
import { getStyles } from "office-ui-fabric-react/lib/components/pickers/BasePicker.styles";
import * as React from "react";

export class TagPickerWrapper extends BasePicker<ITag, ITagPickerProps> {
  public static defaultProps = {
    onRenderItem: (props: ITagItemProps) => <TagItem {...props}>{props.item.name}</TagItem>,
    onRenderSuggestionsItem: (props: ITag) => <TagItemSuggestion>{props.name}</TagItemSuggestion>,
  };

  public componentDidUpdate(prevProp: ITagPickerProps, prevState: IBasePickerState): void {
    super.componentDidUpdate(prevProp, prevState);
    if (!this.state.suggestionsVisible && this.state.isFocused) {
      this.onEmptyInputFocus();
      this.setState({ suggestionsVisible: true });
    }
  }
}

// tslint:disable-next-line:variable-name
export const TagPicker = styled<ITagPickerProps, IBasePickerStyleProps, IBasePickerStyles>(TagPickerWrapper, getStyles, undefined, {
  scope: "TagPicker"
});
