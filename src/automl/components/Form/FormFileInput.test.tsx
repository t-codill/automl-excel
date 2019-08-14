import { shallow, ShallowWrapper } from "enzyme";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import React from "react";
import { reactChangeEvent } from "../../__data__/reactChangeEvent";
import * as blob2stringModule from "../../common/utils/blob2string";
import { IExperimentStepCallback } from "../../startRun/experimentStep/ExperimentStep";
import { FormFileInput } from "./FormFileInput";

jest.mock("./FormBaseInput");

describe("FormFileInput", () => {
    let wrapper: ShallowWrapper<{}, { value: string | undefined }>;
    // tslint:disable-next-line: no-any
    let inputOnChange: any;
    const inputClickMock = jest.fn();
    beforeAll(() => {
        jest.spyOn(React, "createRef")
            .mockImplementation(() => ({
                current: {
                    click: inputClickMock
                }
            }));
        wrapper = shallow(
            <FormFileInput<IExperimentStepCallback, "experimentName">
                field="experimentName"
                required={true}
            />);
        inputOnChange = wrapper.find("input")
            .prop("onChange");
    });

    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should show file picker", () => {
        wrapper
            .find(PrimaryButton)
            .simulate("click");
        expect(inputClickMock)
            .toBeCalled();
    });

    it("should not show file picker if ref is not set", () => {
        const noRefWrapper = shallow(
            <FormFileInput<IExperimentStepCallback, "experimentName">
                field="experimentName"
                required={true}
            />);
        noRefWrapper
            .find(PrimaryButton)
            .simulate("click");
        expect(inputClickMock)
            .not
            .toBeCalled();
    });

    it("should upload file", async () => {
        jest.spyOn(blob2stringModule, "blob2string")
            .mockReturnValue(Promise.resolve("file1"));
        inputOnChange({ ...reactChangeEvent, target: { ...reactChangeEvent.target, files: [new File(["file1"], "file1.txt")] } });
        await Promise.resolve();
        expect(wrapper.state("value"))
            .toBe("file1");
        expect(wrapper.find(TextField)
            .prop("value"))
            .toBe("file1.txt");
    });

    it("should clear value if remove file", () => {
        inputOnChange(reactChangeEvent);
        expect(wrapper.state("value"))
            .toBeUndefined();
    });
});
