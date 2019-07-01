import { render } from "enzyme";
import * as React from "react";
import { NotImplementedError } from "../NotImplementedError";
import { PageNames } from "../PageNames";
import { BaseContext } from "./BaseContext";
import { IBaseContextProps } from "./IBaseContextProps";

describe("BaseContext", () => {
    let context!: IBaseContextProps;
    beforeEach(() => {
        render(
            <div>
                <BaseContext.Consumer>
                    {
                        (value) => {
                            context = value;
                            return <div />;
                        }
                    }
                </BaseContext.Consumer>
            </div>
        );
    });
    it("should read default context", () => {
        expect(context)
            .toMatchSnapshot();
    });
    it("getToken should throw not implemented error ", () => {
        expect(() => {
            context.getToken();
        })
            .toThrowError(new NotImplementedError());
    });
    it("setPageName should throw not implemented error ", () => {
        expect(() => {
            context.setPageName(PageNames.Unknown);
        })
            .toThrowError(new NotImplementedError());
    });
});
