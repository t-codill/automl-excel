import { shallow, ShallowWrapper } from "enzyme";
import { IToggleProps, Toggle } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { IScoringScriptSelectorProps, ScoringScriptSelector } from "./ScoringScriptSelector";

describe("ScoringScriptSelector", () => {

    let tree: ShallowWrapper<IScoringScriptSelectorProps>;
    let condaToggleProps: IToggleProps;
    const mockCallBack = jest.fn();
    const props: IScoringScriptSelectorProps = {
        hasDefaultOption: true,
        onToggle: mockCallBack
    };
    beforeEach(() => {
        tree = shallow(
            <ScoringScriptSelector {...props} />
        );
        condaToggleProps = tree.find(Toggle)
            .props();
        mockCallBack.mockClear();
    });
    describe("Initial Render", () => {
        it("should render date selector dropdown", () => {
            expect(tree)
                .toMatchSnapshot();
        });
    });
    describe("Validate Toggle Options", () => {
        it("should call onToggle", () => {
            if (condaToggleProps && condaToggleProps.onChange) {
                condaToggleProps.onChange(reactMouseEvent, true);
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });
    });
});
