import { ICsvData } from "../common/utils/csv";

export const getDataPrepSettings = (
    dataStoreName: string,
    fileName: string,
    previewData: ICsvData,
    labelColumn: string,
    features: string[]
) => {
    return {
        datastoreName: dataStoreName,
        dataPath: fileName,
        columnSeparator: previewData.delimiter,
        promoteHeader: previewData.hasHeader,
        encoding: "UTF8",
        ignoreNewlineInQuotes: true, // whether to ignore line break in quotes, set to `true` to align with the behavior of PapaParse
        skipRows: 0, // set to `0` to align with the behavior of PapaParse
        features: features.filter((f) => f !== labelColumn),
        label: labelColumn
    };
};
