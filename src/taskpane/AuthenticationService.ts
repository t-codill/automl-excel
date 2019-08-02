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
//import isomorphicFetch from 'isomorphic-fetch'




export { authenticationService as AuthenticationService };
