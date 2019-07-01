import { shallow, ShallowWrapper } from "enzyme";
import { ITag, ITagPickerProps } from "office-ui-fabric-react";
import * as React from "react";
import { ISettingsStepParams } from "../../startRun/settingsSteps/ISettingsStepParams";
import { TagPicker } from "../Base/TagPicker";
import { FormTagPicker } from "./FormTagPicker";

jest.mock("./FormBaseInput");

describe("FormTagPicker", () => {
    let wrapper: ShallowWrapper<{ items: string[] }, { value: string[] | undefined; errorMessage: string | undefined }>;
    let formTagPickerProps: ITagPickerProps;
    beforeEach(() => {
        wrapper = shallow(
            <FormTagPicker<ISettingsStepParams, "grainColumns">
                field="grainColumns"
                placeholder="test place holder"
                items={["item1", "item2", "item3"]}
                id="TagPickerId"
            />);
        formTagPickerProps = wrapper.find(TagPicker)
            .props();
    });

    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should render validation error", () => {
        wrapper.setState({
            errorMessage: "Test Error"
        });
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should on change", () => {
        if (formTagPickerProps.onChange) {
            formTagPickerProps.onChange([{ key: "test key", name: "test text" }]);
        }
        expect(wrapper.state("value"))
            .toEqual(["test key"]);
    });

    it("should on change to empty", () => {
        if (formTagPickerProps.onChange) {
            formTagPickerProps.onChange(undefined);
        }
        expect(wrapper.state("value"))
            .toEqual([]);
    });
    it("should get suggestions when empty", () => {
        let suggestions: ITag[] | undefined;
        if (formTagPickerProps.onEmptyInputFocus) {
            suggestions = formTagPickerProps.onEmptyInputFocus(undefined) as ITag[];
        }
        expect(suggestions)
            .toEqual([
                { name: "item1", key: "item1" },
                { name: "item2", key: "item2" },
                { name: "item3", key: "item3" }
            ]);
    });
    it("should get suggestions with filter", () => {
        let suggestions: ITag[] | undefined;
        if (formTagPickerProps.onEmptyInputFocus) {
            suggestions = formTagPickerProps.onResolveSuggestions("item") as ITag[];
        }
        expect(suggestions)
            .toEqual([
                { name: "item1", key: "item1" },
                { name: "item2", key: "item2" },
                { name: "item3", key: "item3" }
            ]);
    });
    it("should get filter out existing item", () => {
        let suggestions: ITag[] | undefined;
        if (formTagPickerProps.onEmptyInputFocus) {
            suggestions = formTagPickerProps.onResolveSuggestions("item", [{ name: "item1", key: "item1" }]) as ITag[];
        }
        expect(suggestions)
            .toEqual([
                { name: "item2", key: "item2" },
                { name: "item3", key: "item3" }
            ]);
    });
    it("should add style to tags when rendered", () => {
        let tagElement: JSX.Element | undefined;
        if (formTagPickerProps.onRenderItem) {
            tagElement = formTagPickerProps.onRenderItem({
                item: {
                    name: "test1",
                    key: "test1"
                },
                index: 0
            });
        }
        const tagStyle = tagElement ? tagElement.props.styles : undefined;
        expect(tagStyle)
            .toEqual({
                root:
                {
                    lineHeight: 18,
                    margin: 1,
                    maxHeight: 18,
                    minHeight: 18
                }
            });
    });
    it("should regenerate tags when items changed", () => {
        wrapper.setProps({
            items: ["updated1", "updated2", "updated3"]
        });
        expect(wrapper.state("value"))
            .toEqual([]);
        let suggestions: ITag[] | undefined;
        if (formTagPickerProps.onEmptyInputFocus) {
            suggestions = formTagPickerProps.onEmptyInputFocus(undefined) as ITag[];
        }
        expect(suggestions)
            .toEqual([
                { name: "updated1", key: "updated1" },
                { name: "updated2", key: "updated2" },
                { name: "updated3", key: "updated3" }
            ]);
    });
});
