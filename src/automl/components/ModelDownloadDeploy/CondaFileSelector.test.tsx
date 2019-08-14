import { shallow, ShallowWrapper } from "enzyme";
import { IToggleProps, Toggle } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { CondaFileSelector, ICondaFileSelectorProps } from "./CondaFileSelector";

describe("CondaFileSelector", () => {

    let tree: ShallowWrapper<ICondaFileSelectorProps>;
    let condaToggleProps: IToggleProps;
    const mockCallBack = jest.fn();
    const props: ICondaFileSelectorProps = {
        onToggle: mockCallBack
    };
    beforeEach(() => {
        tree = shallow(
            <CondaFileSelector {...props} />
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
