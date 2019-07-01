import { initializeIcons } from "@uifabric/icons";
import { configure } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import "jest-canvas-mock";

initializeIcons();

jest.setTimeout(30000);

// mock context by default
jest.mock("./components/Base/BaseComponentContext");

// mock logger
jest.mock("./common/utils/logger");

// mock moment timezone
const moment = jest.requireActual("moment-timezone");
jest.doMock("moment", () => {
    // Use timezone other than PST and UTC to show independence
    moment.tz.setDefault("Australia/Sydney");
    return moment;
});

if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => "";
}
beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    const dateTimeNowSpy = jest.spyOn(Date, "now");
    dateTimeNowSpy.mockReturnValue(0);
});

configure({ adapter: new ReactSixteenAdapter() });
