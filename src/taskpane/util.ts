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