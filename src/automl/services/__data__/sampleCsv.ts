export const sampleCsv = `a,b,c,d,e
1,2,3,4,5
1,2,3,4,5
1,2,3,4,5
1,2,3,4,5
1,2,3,4,5
`;

const largeCsvHeader = Array(50)
    .fill("aaaaa,bbbbb,ccccc,ddddd,eeeee")
    .join(",");

const largeCsvRow = Array(50)
    .fill("11111,22222,33333,44444,55555")
    .join(",");

export const largeCsv = `${largeCsvHeader}
${Array(50)
        .fill(largeCsvRow)
        .join("\n")}
`;
