import { map, mapKeys } from "lodash";
import Papa from "papaparse";
import { BasicTypes } from "../../common/BasicTypes";
import { IDictionary } from "../../common/IDictionary";
import { uniquefyString } from "./uniquefyString";

export interface ICsvData {
    hasHeader: boolean;
    header: string[];
    data: Array<IDictionary<BasicTypes>>;
    delimiter: string;
}

export function csv(content: string, hasHeader: boolean, lines: number): ICsvData {
    const papaCsv = Papa.parse(content, {
        header: false, // papa parse cannot handle duplicate header name
        preview: lines + (hasHeader ? 1 : 0)
    });
    if (!papaCsv.data || !papaCsv.data[0]) {
        return { hasHeader, header: [], data: [], delimiter: papaCsv.meta.delimiter };
    }
    else if (hasHeader) {
        const header = uniquefyString(papaCsv.data.shift());
        const data = papaCsv.data.map((row) => {
            return mapKeys(row, (_value, index) => header[Number(index)]);
        });
        return { hasHeader, header, data, delimiter: papaCsv.meta.delimiter };
    }
    else {
        const header = map(papaCsv.data[0], (_value, index) => `Column${Number(index) + 1}`);
        const data = papaCsv.data.map((row) => {
            return mapKeys(row, (_value, index) => `Column${Number(index) + 1}`);
        });
        return { hasHeader, header, data, delimiter: papaCsv.meta.delimiter };
    }
}
