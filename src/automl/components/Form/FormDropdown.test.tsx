import { shallow, ShallowWrapper } from "enzyme";
import { IComboBoxOption } from "office-ui-fabric-react";
import * as React from "react";
import { ComboBox, IProps } from "../../common/uiFabricWrappers/comboBox/ComboBox";
import { IExperimentStepCallback } from "../../startRun/experimentStep/ExperimentStep";
import { FormDropdown } from "./FormDropdown";

jest.mock("./FormBaseInput");

describe("FormDropdown", () => {
    let wrapper: ShallowWrapper<{}, { value: string | undefined }>;
    let formDropdownProps: IProps;
    beforeEach(() => {
        const options: IComboBoxOption[] = [{ key: "key1", text: "text1" }, { key: "key2", text: "text2" }, { key: "key3", text: "text3" }];
        wrapper = shallow(
            <FormDropdown<IExperimentStepCallback, "experimentName">
                field="experimentName"
                required={true}
                placeholder="test place holder"
                options={options}
                label="test label"
                id="DropdownId"
            />);
        formDropdownProps = wrapper.find(ComboBox)
            .props();
    });

    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should on change", () => {
        if (formDropdownProps.onOptionSelection) {
            formDropdownProps.onOptionSelection("test text");
        }
        expect(wrapper.state("value"))
            .toBe("test text");
    });

    it("should handle no selection", () => {
        wrapper.setProps({ enableSearch: true });
        if (formDropdownProps.onOptionSelection) {
            formDropdownProps.onOptionSelection(undefined);
        }
        expect(wrapper.state("value"))
            .toBe(undefined);
    });
});
