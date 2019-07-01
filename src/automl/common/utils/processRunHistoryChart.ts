import { chain, countBy, Dictionary } from "lodash";
import moment from "moment";
import { IRunDtoWithExperimentName } from "../../services/RunHistoryService";
import { statusMapping } from "./run";

export function processRunHistoryChart(runList: IRunDtoWithExperimentName[] | undefined): Dictionary<Dictionary<number>> {
    if (!runList || runList.length === 0) {
        return {};
    }

    return chain(runList)
        .groupBy((run) =>
            moment(run.createdUtc)
                .format("YYYY/MM/DD")
        )
        .mapValues(
            (runsInDay) => countBy(runsInDay, (run: IRunDtoWithExperimentName) => run.status && statusMapping[run.status]))
        .value();

}
