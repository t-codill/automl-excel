/*
const authenticationService = {
    async getToken(): Promise<string | undefined> {
        const response = await fetch("/token", {mode: 'cors'});
        const json = await response.json();
        return json.accessToken;
    }
};
*/
//import {polyfill} from 'es6-promise'

//polyfill();
//@ts-ignore
import isomorphicFetch from 'isomorphic-fetch'


function makeRequest (url, method?) {
    return new Promise(function (resolve, reject) {
        
        method = method || 'GET';

        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
        } else {
            reject({
            status: this.status,
            statusText: xhr.statusText
            });
        }
        };
        xhr.onerror = function () {
        reject({
            status: this.status,
            statusText: xhr.statusText
        });
        };
        xhr.send();
    });
}

const authenticationService = {
    async getToken(): Promise<string | undefined> {
        let responsePromise = makeRequest("http://localhost:3001")
        return responsePromise.then(async (response: string) => {
            /*
            const json = await response.json();
            return json.accessToken;
            */
           let json = JSON.parse(response);
           console.log(json)
           return json.accessToken;
        }).catch(async (error) => {
            console.log(JSON.stringify(error))
            return undefined;
        });
    }
};

export { authenticationService as AuthenticationService };
