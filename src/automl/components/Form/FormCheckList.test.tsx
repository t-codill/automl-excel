import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { ISettingsStepParams } from "../../startRun/settingsSteps/ISettingsStepParams";
import { CheckList, ICheckListProps } from "../CheckList/CheckList";
import { FormCheckList } from "./FormCheckList";

jest.mock("./FormBaseInput");

describe("FormCheckList", () => {
  let wrapper: ShallowWrapper<{}, { value: string | undefined }>;
  let formCheckListProps: ICheckListProps;
  beforeEach(() => {
    wrapper = shallow(
      <FormCheckList<ISettingsStepParams, "blacklistAlgos">
        field="blacklistAlgos"
        items={[""]}
      />);
    formCheckListProps = wrapper.find(CheckList)
      .props();
  });

  it("should render", () => {
    expect(wrapper)
      .toMatchSnapshot();
  });

  it("should allow entering free text", () => {
    if (formCheckListProps.onChange) {
      formCheckListProps.onChange(["b"]);
    }
    expect(wrapper.state("value"))
      .toEqual(["b"]);
  });
});
