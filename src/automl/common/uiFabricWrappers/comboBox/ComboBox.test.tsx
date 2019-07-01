import { shallow } from "enzyme";
import { ComboBox as FabricComboBox, IComboBox, SelectableOptionMenuItemType } from "office-ui-fabric-react";
import * as React from "react";
import { ComboBox, IProps } from "./ComboBox";

jest.mock("lodash", () => {
    const _ = jest.requireActual("lodash");
    // tslint:disable-next-line: no-any
    _.debounce = (fn: any) => fn;
    return _;
});

const mockCurrent = jest.fn();
jest.mock("react", () => {
    const react = jest.requireActual("react");
    react.createRef = () => {
        return {
            current: mockCurrent()
        };
    };

    return react;
});

const cbProps: IProps = {
    options: [{ key: "key1", text: "text1" }, { key: "key2", text: "text2" }, { key: "key3", text: "text3" }],
    placeholder: "test place holder",
    label: "test label",
    id: "comboBoxId",
    onOptionSelection: jest.fn()
};

describe("ComboBox", () => {

    beforeEach(() => {
        mockCurrent.mockImplementationOnce(() => null);
    });

    it("should render", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with no placeholder text and no id", () => {
        const { placeholder, id, ...noPlaceholder } = cbProps;
        const wrapper = shallow(
            <ComboBox {...noPlaceholder} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with updated errorMessage props", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} />);
        expect(wrapper)
            .toMatchSnapshot();
        wrapper.setProps({ errorMessage: "some new error!" });
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with no options", () => {
        const { options, ...noOptions } = cbProps;
        const wrapper = shallow(
            <ComboBox {...noOptions} options={[]} />);
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should select option as typed", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} />);
        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, "key2");
        }
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should update options on props change", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} />);
        expect(wrapper)
            .toMatchSnapshot();
        // update options
        wrapper.setProps({ options: [{ key: "newKey1", text: "newTex1" }, { key: "newKey2", text: "newText2" }, { key: "newKey3", text: "newText3" }] });
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should open when focusOnInitially set", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} focusOnInitially={true} />);
        expect(wrapper
            .find(FabricComboBox))
            .toMatchSnapshot();
    });

    it("should handle onClick with no callback", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactMouseEvent = {} as React.MouseEvent<IComboBox>;
        const wrapper = shallow(
            <ComboBox {...cbProps} />);

        const onClick = wrapper
            .find(FabricComboBox)
            .prop("onClick");
        if (onClick) {
            onClick(reactMouseEvent);
        }
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should handle custom text input as new option", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} />);

        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, "SomeNewValueAsOption");
        }
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should handle custom text input as existing option", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} />);

        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, "text1");
        }
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should handle custom text input when input is undefined", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} />);

        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, undefined);
        }
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should handle optionSelection callback", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFormEvent = {} as React.FormEvent<IComboBox>;
        const optionSelection = jest.fn();
        const wrapper = shallow(
            <ComboBox {...cbProps} onOptionSelection={optionSelection} />);
        const onChange = wrapper
            .find(FabricComboBox)
            .prop("onChange");
        if (onChange) {
            onChange(reactFormEvent, cbProps.options[1]);
        }
        expect(optionSelection)
            .toBeCalledTimes(1);
        expect(optionSelection)
            .toHaveBeenCalledWith("key2");
    });

    it("should handle optionSelection callback with custom text", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFormEvent = {} as React.FormEvent<IComboBox>;
        const optionSelection = jest.fn();
        const wrapper = shallow(
            <ComboBox {...cbProps} onOptionSelection={optionSelection} allowFreeform={true} />);
        const onChange = wrapper
            .find(FabricComboBox)
            .prop("onChange");
        if (onChange) {
            onChange(reactFormEvent, undefined, undefined, "text123");
        }
        expect(optionSelection)
            .toBeCalledTimes(1);
        expect(optionSelection)
            .toHaveBeenCalledWith("text123");
    });

    it("should handle optionSelection callback with no text", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFormEvent = {} as React.FormEvent<IComboBox>;
        const optionSelection = jest.fn();
        const wrapper = shallow(
            <ComboBox {...cbProps} onOptionSelection={optionSelection} />);
        const onChange = wrapper
            .find(FabricComboBox)
            .prop("onChange");
        if (onChange) {
            onChange(reactFormEvent, undefined, undefined, undefined);
        }
        expect(optionSelection)
            .toBeCalledTimes(1);
        expect(optionSelection)
            .toHaveBeenCalledWith(undefined);
    });

    it("should display 'Loading...' as placeholder message when loading", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} loading={true} />);
        expect(wrapper
            .find(FabricComboBox))
            .toMatchSnapshot();
    });

    it("should use as-search-box css class if asSearchBox is set", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} asSearchBox={true} />);
        expect(wrapper
            .find(FabricComboBox))
            .toMatchSnapshot();
    });

    it("should render with initial selected key if set", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps} initialSelectedKey="key1" />);
        expect(wrapper
            .find(FabricComboBox))
            .toMatchSnapshot();
    });

    it("should handle header option type", () => {
        const wrapper = shallow(
            <ComboBox {...cbProps}
                options={[
                    {
                        key: "newHeader", text: "--",
                        itemType: SelectableOptionMenuItemType.Header
                    },
                    ...cbProps.options]}
                initialSelectedKey="key1" />);
        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, "SomeNewValueAsOption");
        }
        expect(wrapper
            .find(FabricComboBox))
            .toMatchSnapshot();
    });

    it("should remove headers with no selected options beneath them", () => {
        const wrapper = shallow(
            <ComboBox
                {...cbProps}
                options={[
                    ...cbProps.options,
                    {
                        key: "newHeader", text: "--",
                        itemType: SelectableOptionMenuItemType.Header
                    },
                    {
                        key: "belowHeader",
                        text: "belowHeader"
                    }]}
                initialSelectedKey="key1" />);
        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, "key1");
        }

        expect(wrapper
            .find(FabricComboBox))
            .toMatchSnapshot();
    });

    it("should return option if it's not a header", () => {
        const wrapper = shallow(
            <ComboBox
                {...cbProps}
                options={[
                    {
                        key: "newHeader", text: "--",
                        itemType: SelectableOptionMenuItemType.Header
                    },
                    {
                        key: "belowHeader",
                        text: "belowHeader"
                    }]}
                initialSelectedKey="key1" />);
        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, "belowHeader");
        }

        expect(wrapper
            .find(FabricComboBox))
            .toMatchSnapshot();
    });

    it("should handle onClick callback", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactMouseEvent = {} as React.MouseEvent<IComboBox>;
        const clickHandler = jest.fn();
        const wrapper = shallow(
            <ComboBox {...cbProps} onClick={clickHandler} />);

        const onClick = wrapper
            .find(FabricComboBox)
            .prop("onClick");
        if (onClick) {
            onClick(reactMouseEvent);
        }
        expect(clickHandler)
            .toBeCalledTimes(1);
    });

    it("should handle onClick and focus", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactMouseEvent = {} as React.MouseEvent<IComboBox>;

        const wrapper = shallow(
            <ComboBox {...cbProps} />);

        const onClick = wrapper
            .find(FabricComboBox)
            .prop("onClick");
        if (onClick) {
            onClick(reactMouseEvent);
        }
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should trigger componentRef focus", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFocusEvent = {} as React.FocusEvent<IComboBox>;
        const mockFocus = jest.fn();
        mockCurrent.mockReset();
        mockCurrent.mockImplementationOnce((): IComboBox => ({
            dismissMenu: () => undefined,
            focus: mockFocus,
            selectedOptions: []
        }));
        const wrapper = shallow(
            <ComboBox {...cbProps} />);

        const onFocus = wrapper
            .find(FabricComboBox)
            .prop("onFocus");
        if (onFocus) {
            onFocus(reactFocusEvent);
        }

        expect(mockFocus)
            .toBeCalledTimes(1);
        expect(mockFocus)
            .toBeCalledWith(true);
    });

    it("should trim space on freeform text as option", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFormEvent = {} as React.FormEvent<IComboBox>;
        const optionSelection = jest.fn();
        const wrapper = shallow(
            <ComboBox {...cbProps} onOptionSelection={optionSelection} allowFreeform={true} />);
        const onChange = wrapper
            .find(FabricComboBox)
            .prop("onChange");
        if (onChange) {
            onChange(reactFormEvent, undefined, undefined, " newOption1  ");
        }
        expect(optionSelection)
            .toBeCalledTimes(1);
        expect(optionSelection)
            .toHaveBeenCalledWith("newOption1");
    });

    it("should not select disabled option", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFormEvent = {} as React.FormEvent<IComboBox>;
        const options = [{ key: "disabledOptionKey", text: "disabledOptionText", disabled: true }];
        const wrapper = shallow(
            <ComboBox
                {...cbProps}
                options={options}
                allowFreeform={true} />);
        const onChange = wrapper
            .find(FabricComboBox)
            .prop("onChange");
        if (onChange) {
            onChange(reactFormEvent, options[0], undefined, undefined);
        }

        expect(wrapper.state<ComboBox>("selectedKey"))
            .toBe(undefined);
    });

    it("should not autocomplete if free text", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFormEvent = {} as React.FormEvent<IComboBox>;
        const wrapper = shallow(
            <ComboBox
                {...cbProps}
                allowFreeform={true} />);
        const autoComplete = wrapper
            .find(FabricComboBox)
            .prop("autoComplete");
        expect(autoComplete)
            .toBe("off");
        const onChange = wrapper
            .find(FabricComboBox)
            .prop("onChange");
        if (onChange) {
            onChange(reactFormEvent, undefined, undefined, "tex");
        }
        expect(wrapper.state<ComboBox>("selectedKey"))
            .toBe("tex");
    });

    it("should not select if no match and free form is disabled", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFormEvent = {} as React.FormEvent<IComboBox>;
        const options = [{ key: "key1", text: "text1" }, { key: "key2", text: "text2" }];
        const wrapper = shallow(
            <ComboBox
                {...cbProps}
                options={options}
                allowFreeform={false} />);
        const onChange = wrapper
            .find(FabricComboBox)
            .prop("onChange");
        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onChange && onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, "test");
            onChange(reactFormEvent, undefined, undefined, "test");
        }

        expect(wrapper.state<ComboBox>("selectedKey"))
            .toBe(undefined);
    });
    it("should not select if match option is disabled and free form is disabled", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFormEvent = {} as React.FormEvent<IComboBox>;
        const options = [{ key: "key1", text: "text1", disabled: true }];
        const wrapper = shallow(
            <ComboBox
                {...cbProps}
                options={options}
                allowFreeform={false} />);
        const onChange = wrapper
            .find(FabricComboBox)
            .prop("onChange");
        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onChange && onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, "text");
            onChange(reactFormEvent, undefined, undefined, "text");
        }

        expect(wrapper.state<ComboBox>("selectedKey"))
            .toBe(undefined);
    });
    it("should select first non disabled filtered option if free form is disabled", () => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const reactFormEvent = {} as React.FormEvent<IComboBox>;
        const options = [{ key: "key1", text: "text1", disabled: true }, { key: "key2", text: "text2" }];
        const wrapper = shallow(
            <ComboBox
                {...cbProps}
                options={options}
                allowFreeform={false} />);
        const onChange = wrapper
            .find(FabricComboBox)
            .prop("onChange");
        const onPendingValueChanged = wrapper
            .find(FabricComboBox)
            .prop("onPendingValueChanged");
        if (onChange && onPendingValueChanged) {
            onPendingValueChanged(undefined, undefined, "te");
            onChange(reactFormEvent, undefined, undefined, "te");
        }

        expect(wrapper.state<ComboBox>("selectedKey"))
            .toBe("key2");
    });
});
