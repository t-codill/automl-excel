import { mount } from "enzyme";
import * as React from "react";
import serializeJavascript from "serialize-javascript";
import { AnyParameters } from "../../addMockParameters";
import { NotImplementedError } from "../../common/NotImplementedError";
import { FormContext } from "./FormContext";

describe("FormContext", () => {
    it("should render with default value", () => {
        expect(mount(<div>
            <FormContext.Consumer>
                {(val) => {
                    return <div>{JSON.stringify(val)}</div>;
                }}
            </FormContext.Consumer>
        </div>))
            .toMatchSnapshot();
    });
    it("default mount should throw not implement error", () => {
        let mountFunc: (...component: AnyParameters) => void;
        mount(<div>
            <FormContext.Consumer>
                {(val) => {
                    mountFunc = val.mount;
                    return <div>{serializeJavascript(val)}</div>;
                }}
            </FormContext.Consumer>
        </div>);
        expect(() => { mountFunc({}); })
            .toThrowError(new NotImplementedError());
    });
    it("default unmount should throw not implement error", () => {
        let unmountFunc: (...component: AnyParameters) => void;
        mount(<div>
            <FormContext.Consumer>
                {(val) => {
                    unmountFunc = val.unmount;
                    return <div>{serializeJavascript(val)}</div>;
                }}
            </FormContext.Consumer>
        </div>);
        expect(() => { unmountFunc({}); })
            .toThrowError(new NotImplementedError());
    });
    it("should be able to take value", () => {
        expect(mount(<div>
            <FormContext.Provider value={
                {
                    mount(): string { return "mount input"; },
                    unmount(): string { return "unmount input"; },
                    onUpdated(): string { return "onUpdated func"; },
                }
            }>
                <FormContext.Consumer>
                    {(val) => {
                        return <div>{serializeJavascript(val)}</div>;
                    }}
                </FormContext.Consumer>
            </FormContext.Provider>
        </div >))
            .toMatchSnapshot();
    });
});
