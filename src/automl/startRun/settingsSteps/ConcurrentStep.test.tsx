import { shallow } from "enzyme";
import * as React from "react";
import { ConcurrentStep } from "./ConcurrentStep";

describe("Concurrent Iterations", () => {
    it("should render with validation error undefined props", () => {
        const c = { compute: undefined };
        const tree = shallow(
            <ConcurrentStep {...c} />
        );
        expect(tree)
            .toMatchSnapshot();
    });
});
