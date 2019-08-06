import * as React from 'react'
import {AppContext} from './AppContext'
import { updateState } from './util';
import {polyfill} from 'es6-promise'
import { authMethod } from '../../../config';
import { apiUrl } from '../util';
import { PageLoad } from './PageLoad';

polyfill();

const clientId = "2d854c46-8b8e-4128-9329-613e1039c582";

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

async function getCliToken(): Promise<string | undefined> {
    let responsePromise = makeRequest(apiUrl + "/cli_token")
    return responsePromise.then(async (response: string) => {
        /*
        const json = await response.json();
        return json.accessToken;
        */
        let json = JSON.parse(response);
        return json.accessToken;
    }).catch(async (error) => {
        console.log(JSON.stringify(error))
        return undefined;
    });
}


interface LoginState{
    authorizationCode: string;
    token: string;
}

export default class Login extends React.Component<{}, LoginState>{
    static contextType = AppContext;

    constructor(props, context){
        super(props, context);

        this.state = {
            authorizationCode: "",
            token: ""
        }

        if(authMethod === "dialog"){
        
            let dialogUrl = "https://localhost:3000/taskpane/logindialog";
            
            Office.context.ui.displayDialogAsync(dialogUrl, {width: 50, height: 50}, (result) => {
                let dialog = result.value;
                dialog.addEventHandler(Office.EventType.DialogMessageReceived, async (arg) => {
                    dialog.close();
                    await updateState(this, {
                        authorizationCode: arg.message
                    });
                    this.requestToken();
                })
            });
        }else if(authMethod === "office"){
            Office.context.auth.getAccessTokenAsync(function(result){
                if(result.status === Office.AsyncResultStatus.Succeeded){
                    let ssoToken = result.value;
                    console.log(ssoToken);
                }else{
                    if(result.error.code === 13003){
                    }else{
                        console.log(result.error);
                    }
                }
            })
        }else if(authMethod === "cli"){
            getCliToken().then(token => {
                this.context.setToken(token);
            })
        }else{
            console.log("Invalid authentication method ".concat(authMethod).concat("!"));
        }
    };

    async requestToken(){
        console.log("Requesting token...");
        let url = `/api/token`;
        let body = {
            clientId: clientId,
            code: this.state.authorizationCode,
        }
        try{
            let response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            let tokenData = await response.json();
            this.setState({
                token: tokenData.access_token
            })
            this.context.setToken(tokenData.access_token);
        }catch(error){
            console.log(error);
        }
    }
    
    render(){
        return <PageLoad text="Logging in" />
    }
}