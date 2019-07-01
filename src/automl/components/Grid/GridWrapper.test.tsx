import { shallow } from "enzyme";
import * as React from "react";
import { GridWrapper } from "./GridWrapper";
import { IGridProps } from "./IGridProps";

describe("GridWrapper", () => {
    it("should render", () => {
        const props: IGridProps = {
            gridElementPropsList: [
                { title: "element1 section", element: <div />, key: "element1", x: 0, y: 0, width: 10, height: 5 },
                { title: "element2 section", element: <div />, key: "element2", x: 0, y: 1, width: 10, height: 5 }
            ]
        };
        const wrapper = shallow(<GridWrapper {...props} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render elements with class name", () => {
        const props: IGridProps = {
            gridElementPropsList: [
                { title: "element1 section", element: <div />, key: "element1", x: 0, y: 0, width: 10, height: 5, className: "grid-item sm" },
                { title: "element2 section", element: <div />, key: "element2", x: 0, y: 1, width: 10, height: 5, className: "grid-item sm" }
            ]
        };
        const wrapper = shallow(<GridWrapper {...props} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render elements with no title ", () => {
        const props: IGridProps = {
            gridElementPropsList: [
                { element: <div />, key: "element1", x: 0, y: 0, width: 10, height: 5 },
                { element: <div />, key: "element2", x: 0, y: 1, width: 10, height: 5 }
            ]
        };
        const wrapper = shallow(<GridWrapper {...props} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with custom column sizes", () => {
        const props: IGridProps = {
            gridElementPropsList: [
                { title: "element1 section", element: <div />, key: "element1", x: 0, y: 0, width: 10, height: 5 },
                { title: "element2 section", element: <div />, key: "element2", x: 0, y: 1, width: 10, height: 5 }
            ],
            cols: {
                lg: 24,
                md: 20,
                sm: 12,
                xs: 8,
                xxs: 4
            }
        };
        const wrapper = shallow(<GridWrapper {...props} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with specific row height", () => {
        const props: IGridProps = {
            gridElementPropsList: [
                { title: "element1 section", element: <div />, key: "element1", x: 0, y: 0, width: 10, height: 5 },
                { title: "element2 section", element: <div />, key: "element2", x: 0, y: 1, width: 10, height: 5 }
            ],
            rowHeight: 15
        };
        const wrapper = shallow(<GridWrapper {...props} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with specific margin", () => {
        const props: IGridProps = {
            gridElementPropsList: [
                { title: "element1 section", element: <div />, key: "element1", x: 0, y: 0, width: 10, height: 5 },
                { title: "element2 section", element: <div />, key: "element2", x: 0, y: 1, width: 10, height: 5 }
            ],
            margin: [5, 5]
        };
        const wrapper = shallow(<GridWrapper {...props} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with specific margin and row height", () => {
        const props: IGridProps = {
            gridElementPropsList: [
                { title: "element1 section", element: <div />, key: "element1", x: 0, y: 0, width: 10, height: 5 },
                { title: "element2 section", element: <div />, key: "element2", x: 0, y: 1, width: 10, height: 5 }
            ],
            rowHeight: 15,
            margin: [5, 5]
        };
        const wrapper = shallow(<GridWrapper {...props} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
