import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { FormBaseInput } from "./FormBaseInput";
import { IFormContextProps } from "./IFormContextProps";

interface IFormBaseInputTestData {
  name: string;
}

const mount = jest.fn();
const unmount = jest.fn();
const onUpdated = jest.fn();
const validator = jest.fn();
const testFormContext: IFormContextProps = {
  mount,
  unmount,
  onUpdated
};

class FormBaseInputTester extends FormBaseInput<IFormBaseInputTestData, "name", string>{
  public get context(): IFormContextProps { return testFormContext; }
  public set context(_: IFormContextProps) { return; }
  public render(): React.ReactNode {
    return <div />;
  }
  public setValue(val: string): void {
    super.setValue(val);
  }
}

describe("FormBaseInput", () => {
  let wrapper: ShallowWrapper<{}, { value: string | undefined }, FormBaseInputTester>;
  beforeEach(() => {
    wrapper = shallow(
      <FormBaseInputTester
        field="name"
        defaultFormValue="defaultValue"
        validators={[validator]}
      />, {
        context: testFormContext
      });
  });

  it("should render", () => {
    expect(wrapper)
      .toMatchSnapshot();
  });

  it("should mount", (done) => {
    setImmediate(() => {
      expect(mount)
        .toBeCalledWith(wrapper.instance());
      done();
    });
  });

  it("should set default value", (done) => {
    wrapper.setProps({ defaultFormValue: "default value updated" });
    setImmediate(() => {
      expect(wrapper.state("value"))
        .toBe("default value updated");
      done();
    });
  });

  it("should validate", () => {
    const comp = wrapper
      .instance();
    comp.validate();
    expect(validator)
      .toBeCalledTimes(1);
    expect(comp.state.errorMessage)
      .toBeUndefined();
  });

  it("should validate with error", () => {
    const comp = wrapper
      .instance();
    validator.mockReturnValue("sample error");
    comp.validate();
    expect(validator)
      .toBeCalledTimes(1);
    expect(comp.state.errorMessage)
      .toBe("sample error");
  });

  it("should validate without validator", () => {
    const noValidateWrapper = shallow<FormBaseInputTester>(
      <FormBaseInputTester
        field="name"
        defaultFormValue="defaultValue"
      />, {
        context: testFormContext
      });
    const comp = noValidateWrapper
      .instance();
    comp.validate();
    expect(comp.state.errorMessage)
      .toBeUndefined();
  });

  it("should set and get value", () => {
    const comp = wrapper
      .instance();
    comp.setValue("test value");
    expect(comp.getValue())
      .toBe("test value");
    expect(onUpdated)
      .toBeCalledWith("name", "test value");
  });

  it("should set value without onUpdate callback", () => {
    const comp = wrapper
      .instance();
    testFormContext.onUpdated = undefined;
    comp.setValue("test value 2");
    expect(comp.getValue())
      .toBe("test value 2");
  });

  it("should unmount", () => {
    const comp = wrapper
      .instance();
    if (comp.componentWillUnmount) {
      comp.componentWillUnmount();
    }
    expect(unmount)
      .toBeCalledTimes(1);
  });
});
