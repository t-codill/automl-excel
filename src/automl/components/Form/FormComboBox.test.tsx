import { shallow, ShallowWrapper } from "enzyme";
import { IComboBoxOption } from "office-ui-fabric-react";
import * as React from "react";
import { ComboBox, IProps } from "../../common/uiFabricWrappers/comboBox/ComboBox";
import { IExperimentStepCallback } from "../../startRun/experimentStep/ExperimentStep";
import { FormComboBox } from "./FormComboBox";

jest.mock("./FormBaseInput");

describe("FormComboBox", () => {
    let wrapper: ShallowWrapper<{}, { value: string | undefined }>;
    let formComboBoxProps: IProps;
    beforeEach(() => {
        const options: IComboBoxOption[] = [{ key: "key1", text: "text1" }, { key: "key2", text: "text2" }, { key: "key3", text: "text3" }];
        wrapper = shallow(
            <FormComboBox<IExperimentStepCallback, "experimentName">
                field="experimentName"
                required={true}
                placeholder="test place holder"
                options={options}
                label="test label"
                id="comboBoxId"
            />);
        formComboBoxProps = wrapper.find(ComboBox)
            .props();
    });

    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should allow searching an option", () => {
        if (formComboBoxProps.onOptionSelection) {
            formComboBoxProps.onOptionSelection("test text");
        }
        expect(wrapper.state("value"))
            .toBe("test text");
    });

    it("should handle no selection", () => {
        wrapper.setProps({ enableSearch: true });
        if (formComboBoxProps.onOptionSelection) {
            formComboBoxProps.onOptionSelection(undefined);
        }
        expect(wrapper.state("value"))
            .toBe(undefined);
    });
});
