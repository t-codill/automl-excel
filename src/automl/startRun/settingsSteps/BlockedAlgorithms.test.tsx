import { shallow } from "enzyme";
import * as React from "react";
import { FormCheckList } from "../../components/Form/FormCheckList";
import { Algorithms } from "../../services/constants/Algorithms";
import { BlockedAlgorithms } from "./BlockedAlgorithms";

describe("BlockedAlgorithms", () => {
    it("should get classification algorithms", () => {
        const wrapper = shallow<BlockedAlgorithms>(<BlockedAlgorithms jobType="classification" />);
        const items = wrapper.find(FormCheckList)
            .props()
            .items;
        expect(items)
            .toContain("XGBoostClassifier");

    });
    it("should get regression algorithms", () => {
        const wrapper = shallow<BlockedAlgorithms>(<BlockedAlgorithms jobType="regression" />);
        const items = wrapper.find(FormCheckList)
            .props()
            .items;
        expect(items)
            .toContain("XGBoostRegressor");
    });
    it("should get forecasting algorithms", () => {
        const wrapper = shallow<BlockedAlgorithms>(<BlockedAlgorithms jobType="forecasting" />);
        const items = wrapper.find(FormCheckList)
            .props()
            .items;
        expect(items)
            .toContain("XGBoostRegressor");
    });
    it("should change when jobType changed", () => {
        const wrapper = shallow<BlockedAlgorithms>(<BlockedAlgorithms jobType="classification" />);
        wrapper.setProps({ jobType: "forecasting" });
        const items = wrapper.find(FormCheckList)
            .props()
            .items;
        expect(items)
            .toContain("XGBoostRegressor");
    });
    it("should validate", () => {
        const wrapper = shallow<BlockedAlgorithms>(<BlockedAlgorithms jobType="classification" />);
        const validators = wrapper.find(FormCheckList)
            .prop("validators") || [];
        expect(validators[0]([]))
            .toBeUndefined();
    });
    it("should throw error if all algorithms are selected", () => {
        const wrapper = shallow<BlockedAlgorithms>(<BlockedAlgorithms jobType="classification" />);
        const validators = wrapper.find(FormCheckList)
            .prop("validators") || [];
        expect(validators[0](Algorithms.classification))
            .toMatch(/\w+/);
    });
});
