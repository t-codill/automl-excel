import { shallow, ShallowWrapper } from "enzyme";
import { BasePicker, IBasePickerState, ITag, ITagItemProps, ITagPickerProps } from "office-ui-fabric-react";
import * as React from "react";
import { TagPickerWrapper } from "./TagPicker";

describe("TagPicker", () => {
    const onRemoveSuggestion = jest.fn();
    function onResolveSuggestions(text: string): ITag[] {
        return [
            "black",
            "blue",
            "brown",
            "cyan",
            "green",
            "magenta",
            "mauve",
            "orange",
            "pink",
            "purple",
            "red",
            "rose",
            "violet",
            "white",
            "yellow"
        ]
            .filter((tag) => tag.toLowerCase()
                .indexOf(text.toLowerCase()) === 0)
            .map((item) => ({ key: item, name: item }));
    }
    const iTagProps: ITagItemProps = {
        className: undefined,
        enableTagFocusInDisabledPicker: true,
        item: {
            key: "Test Key",
            name: "Test Name"
        },
        index: 0
    };
    const iTag: ITag = {
        name: "Test Tag Name",
        key: "Test Tag Key"
    };

    let wrapper: ShallowWrapper<ITagPickerProps, IBasePickerState>;
    const props: ITagPickerProps = {
        onRemoveSuggestion,
        onResolveSuggestions
    };
    beforeEach(() => {

        jest.spyOn(BasePicker.prototype as unknown as { onEmptyInputFocus(): void }, "onEmptyInputFocus")
            .mockImplementation(() => {
                return;
            });
        wrapper = shallow(
            <TagPickerWrapper {...props}
            />);
    });

    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should render item and suggestion", () => {
        const renderItem = TagPickerWrapper.defaultProps.onRenderItem(iTagProps);
        const renderSuggestionItem = TagPickerWrapper.defaultProps.onRenderSuggestionsItem(iTag);
        expect(renderItem)
            .toMatchSnapshot();
        expect(renderSuggestionItem)
            .toMatchSnapshot();
    });

    it("should trigger update", () => {
        wrapper.setState({
            suggestionsVisible: false,
            isFocused: true
        });
        wrapper.update();
        expect(wrapper)
            .toMatchSnapshot();
    });
});
