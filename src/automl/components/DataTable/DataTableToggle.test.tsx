import { shallow, ShallowWrapper } from "enzyme";
import { Toggle } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { DataTableToggle, IDataTableToggleProps } from "./DataTableToggle";

describe("DataTableToggle", () => {
        const onColumnSelectorChanged = jest.fn();
        let wrapper: ShallowWrapper<IDataTableToggleProps>;
        beforeEach(() => {
                wrapper = shallow(<DataTableToggle
                        toggleProps={{
                                defaultState: true,
                                label: "toggle",
                                offText: "offText",
                                onText: "onText",
                                onColumnSelectorChanged
                        }}
                        columnName="testColumn"
                />);
        });

        it("should render", () => {
                expect(wrapper)
                        .toMatchSnapshot();
        });

        it("should toggle", () => {
                const toggleProps =
                        wrapper.find(Toggle)
                                .props();
                if (toggleProps.onChange) {
                        toggleProps.onChange(reactMouseEvent, true);
                }
                expect(onColumnSelectorChanged)
                        .toBeCalledWith("testColumn", true);
        });
});
