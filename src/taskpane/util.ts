import { useTls, apiPortWhenDeveloping } from "../../config";

export const apiUrl = (useTls ? "https" : "http") + "://localhost:" + apiPortWhenDeveloping + "/api";

export async function tunnelRequest(url: string, options?: RequestInit){
    let response = await fetch(apiUrl + '/tunnel', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: url,
            options: options
        })
    });
    console.log("Response:");
    let jsonObj = await response.json();
    console.log(jsonObj)
    return jsonObj;
}

export function makeCsv(values): string{
    let csv = ""
    for(var i = 0; i < values.length; i++){
        for(var j = 0; j < values[i].length; j++){
            let value = values[i][j];
            try{
                if((typeof value === 'string' || value instanceof String) && value.includes(",")){
                    value = '"' + value + '"';
                }
                csv += value + ", ";
            }catch(err){console.log(err);}
        }
        csv += "\n";
    }
    return csv;
}

export async function getSwagger(deploymentObj: any){
    let swaggerUrl = deploymentObj.scoringUri.replace("/score", "/swagger.json");

    let response = await fetch(apiUrl + '/swagger', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: swaggerUrl,
        })
    });
    let jsonObj = await response.json();
    return jsonObj;
}