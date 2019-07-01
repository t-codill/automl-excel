import { shallow, ShallowWrapper } from "enzyme";
import { ITextFieldProps, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { reactFormEvent } from "../../__data__/reactFormEvent";
import { IExperimentStepCallback } from "../../startRun/experimentStep/ExperimentStep";
import { FormTextInput } from "./FormTextInput";

jest.mock("./FormBaseInput");

describe("FormTextInput", () => {
    let wrapper: ShallowWrapper<{}, { value: string | undefined }>;
    let formTextFieldProps: ITextFieldProps;
    beforeEach(() => {
        wrapper = shallow(
            <FormTextInput<IExperimentStepCallback, "experimentName">
                field="experimentName"
                required={true}
                placeholder="test place holder"
                label="test label"
                id="TextFieldId"
            />);
        formTextFieldProps = wrapper.find(TextField)
            .props();
    });

    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should allow entering free text", () => {
        if (formTextFieldProps.onChange) {
            formTextFieldProps.onChange(reactFormEvent, "free text");
        }
        expect(wrapper.state("value"))
            .toBe("free text");
    });
});
