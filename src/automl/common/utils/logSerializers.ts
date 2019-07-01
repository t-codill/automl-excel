import { merge } from "lodash";
import { AdvancedSetting } from "../../services/AdvancedSetting";

const advancedSettingsLogSerializer = (advancedSetting: AdvancedSetting) => {

    return JSON.stringify(merge(
        {},
        advancedSetting,
        {
            column: advancedSetting.column.length,
            timeSeriesColumn: advancedSetting.timeSeriesColumn ? advancedSetting.timeSeriesColumn.length : advancedSetting.timeSeriesColumn,
            grainColumns: advancedSetting.grainColumns ? advancedSetting.grainColumns.length : advancedSetting.grainColumns
        }
    ), null, 2);
};

export const logSerializers = {
    advancedSettingsLogSerializer
};
