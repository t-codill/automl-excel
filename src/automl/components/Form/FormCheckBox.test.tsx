import { shallow, ShallowWrapper } from "enzyme";
import { Checkbox, ICheckboxProps } from "office-ui-fabric-react";
import * as React from "react";
import { reactFormEvent } from "../../__data__/reactFormEvent";
import { ISettingsStepParams } from "../../startRun/settingsSteps/ISettingsStepParams";
import { FormCheckBox } from "./FormCheckBox";

jest.mock("./FormBaseInput");

describe("FormCheckBox", () => {
  let wrapper: ShallowWrapper<{}, { value: boolean | undefined }>;
  let formCheckBoxProps: ICheckboxProps;
  beforeEach(() => {
    wrapper = shallow(
      <FormCheckBox<ISettingsStepParams, "preprocessing">
        field="preprocessing"
        defaultFormValue={true}
      />);
    formCheckBoxProps = wrapper
      .find(Checkbox)
      .props();
  });

  it("should render", () => {
    expect(wrapper)
      .toMatchSnapshot();
  });

  it("should take default value", () => {
    expect(wrapper.state("value"))
      .toBe(true);
  });

  it("should allow entering free text", () => {
    if (formCheckBoxProps.onChange) {
      formCheckBoxProps.onChange(reactFormEvent, false);
    }
    expect(wrapper.state("value"))
      .toEqual(false);
  });
});
