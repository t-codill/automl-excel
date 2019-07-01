import { largeCsv, sampleCsv } from "../../services/__data__/sampleCsv";
import { csv } from "./csv";

describe("csv", () => {
    it("preview blob with header", async () => {
        const result = csv(sampleCsv, true, 5);
        expect(result)
            .toMatchSnapshot();
    });

    it("preview blob without header", async () => {
        const result = csv(sampleCsv, false, 5);
        expect(result)
            .toMatchSnapshot();
    });

    it("preview blob without data", async () => {
        const result = csv("", true, 5);
        expect(result)
            .toMatchSnapshot();
    });
    it("preview blob with large csv", async () => {
        const result = csv(largeCsv, true, 5);
        expect(result)
            .toMatchSnapshot();
    });
});
