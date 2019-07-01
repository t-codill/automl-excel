import { shallow } from "enzyme";
import * as React from "react";
import { RunStatus } from "./RunStatus";

describe("Run Status", () => {

    it("should render loading image when no run", () => {
        const tree = shallow(<RunStatus run={undefined} />);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
    it.each([
        "Running",
        "Preparing",
        "Provisioning",
        "Queued",
        "Starting",
        "Finalizing",
        "Completed",
        "Failed",
        "NotStarted",
        "CancelRequested",
        "Canceled",
        "NotResponding",
    ])("should render when run %s", (status) => {
        const tree = shallow(<RunStatus run={{
            status
        }} />);
        expect(tree)
            .toMatchSnapshot();

    });

    it("should render error message when parent run failed", () => {
        const tree = shallow(<RunStatus
            run={{
                status: "Failed",
                properties: {
                    errors: "Test parent run error message"
                }
            }}
            experimentName="Foo"
        />);
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render error message when child run failed", () => {
        const tree = shallow(<RunStatus
            run={{
                status: "Failed",
                error: {
                    error: {
                        message: "Test child run error message"
                    }
                }
            }}
            experimentName="Foo"
        />);
        expect(tree)
            .toMatchSnapshot();
    });
});
