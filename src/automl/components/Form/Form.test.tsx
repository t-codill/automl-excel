import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { reactFormEvent } from "../../__data__/reactFormEvent";
import { ISettingsStepParams } from "../../startRun/settingsSteps/ISettingsStepParams";
import { Form } from "./Form";
import { FormContext } from "./FormContext";

const onSubmit = jest.fn();
const onUpdated = jest.fn();
const validate = jest.fn();
const testInput = {
  validate,
  props: {
    field: "testField"
  },
  getValue(): string { return "testValue"; }
};

describe("Form", () => {
  let wrapper: ShallowWrapper<{}, { value: string | undefined }, Form<ISettingsStepParams>>;
  beforeAll(() => {
    wrapper = shallow(
      <Form<ISettingsStepParams> onSubmit={onSubmit} onUpdated={onUpdated} >
      </Form>
    );
  });

  it("should render", () => {
    expect(wrapper)
      .toMatchSnapshot();
  });

  it("should mount input", () => {
    wrapper
      .find(FormContext.Provider)
      .prop("value")
      .mount(testInput);
  });

  it("should submit", () => {
    const formOnSubmit = wrapper
      .find("form")
      .prop("onSubmit");
    if (formOnSubmit) {
      formOnSubmit(reactFormEvent);
    }
    expect(validate)
      .toBeCalledTimes(1);
    expect(onSubmit)
      .toBeCalledWith({ testField: "testValue" });
  });

  it("should not submit if invalid", () => {
    const formOnSubmit = wrapper
      .find("form")
      .prop("onSubmit");
    validate.mockReturnValueOnce("invalid value");
    if (formOnSubmit) {
      formOnSubmit(reactFormEvent);
    }
    expect(validate)
      .toBeCalledTimes(1);
    expect(onSubmit)
      .toBeCalledTimes(0);
  });

  it("should unmount input", () => {
    wrapper
      .find(FormContext.Provider)
      .prop("value")
      .unmount(testInput);
    const formOnSubmit = wrapper
      .find("form")
      .prop("onSubmit");
    if (formOnSubmit) {
      formOnSubmit(reactFormEvent);
    }
    expect(validate)
      .toBeCalledTimes(0);
    expect(onSubmit)
      .toBeCalledWith({});
  });
});
