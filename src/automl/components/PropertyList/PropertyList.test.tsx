import { shallow } from "enzyme";
import * as React from "react";
import { IDictionary } from "../../common/IDictionary";
import { PropertyList } from "./PropertyList";

describe("PropertyList", () => {
    it("should render", () => {
        const stateCapitals: IDictionary<string> = {
            Alabama: "Montgomery",
            Alaska: "Juneau",
            Arizona: "Phoenix",
            Arkansas: "Little Rock",
            California: "Sacramento",
            Colorado: "Denver",
            Connecticut: "Hartford",
            Delaware: "Dover",
            Florida: "Tallahassee",
            Georgia: "Atlanta",
            Hawaii: "Honolulu",
            Idaho: "Boise",
            Illinois: "Springfield",
            Indiana: "Indianapolis",
            Iowa: "Des Moines",
            Kansas: "Topeka",
            Kentucky: "Frankfort",
            Louisiana: "Baton Rouge",
            Maine: "Augusta",
            Maryland: "Annapolis",
            Massachusetts: "Boston",
            Michigan: "Lansing",
            Minnesota: "St.Paul",
            Mississippi: "Jackson",
            Missouri: "Jefferson City",
            Montana: "Helena",
            Nebraska: "Lincoln",
            Nevada: "Carson City",
            NewHampshire: "Concord",
            NewJersey: "Trenton",
            NewMexico: "Santa Fe",
            NewYork: "Albany",
            NorthCarolina: "Raleigh",
            NorthDakota: "Bismarck",
            Ohio: "Columbus",
            Oklahoma: "Oklahoma City",
            Oregon: "Salem",
            Pennsylvania: "Harrisburg",
            RhodeIsland: "Providence",
            SouthCarolina: "Columbia",
            SouthDakota: "Pierre",
            Tennessee: "Nashville",
            Texas: "Austin",
            Utah: "Salt Lake City",
            Vermont: "Montpelier",
            Virginia: "Richmond",
            Washington: "Olympia",
            WestVirginia: "Charleston",
            Wisconsin: "Madison",
            Wyoming: "Cheyenne"
        };
        const wrapper = shallow(<PropertyList listElements={stateCapitals} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render list values", () => {
        const colors: string[] = ["red", "green", "blue"];
        const wrapper = shallow(<PropertyList listElements={{ colors }} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render no data when list is empty", () => {
        const empty = {};
        const wrapper = shallow(<PropertyList listElements={empty} />);
        expect(wrapper)
            .toMatchSnapshot();
    });

});
