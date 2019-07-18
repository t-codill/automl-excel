import * as React from 'react'
import {AppContext} from './AppContext'
import { Spinner } from 'office-ui-fabric-react';
import { updateState } from './util';
import { Redirect } from 'react-router';

//const clientId = "2d854c46-8b8e-4128-9329-613e1039c582";
const clientId = "2d854c46-8b8e-4128-9329-613e1039c582";

interface LoginState{
    authorizationCode: string;
    token: string;
}

export default class Login extends React.Component<{}, LoginState>{
    static contextType = AppContext;
    iframeRef: React.RefObject<HTMLIFrameElement>;
    url: string = "";
    constructor(props, context){
        super(props, context);
        
        this.state = {
            authorizationCode: "",
            token: ""
        }

        this.url = `https://login.microsoftonline.com/common/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080/taskpane/auth&response_mode=query`;
        let dialogUrl = "https:/localhost:8080/dialogopen";
        console.log('url = ');
        console.log(dialogUrl);
        Office.context.ui.displayDialogAsync(dialogUrl, {}, (result) => {
            console.log("result:")
            console.log(result);
        });

        window.addEventListener("message", async (event) => {
            if(!event.data.hasOwnProperty('code')) return;
            await updateState(this, {
                authorizationCode: event.data.code
            })
            this.requestToken();
        });
    };

    async requestToken(){
        let url = `http://${window.location.hostname}:3000/api/token`;
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
        }catch(error){
            console.log(error);
        }
    }

    render(){

        if(this.state.authorizationCode === ""){
            return <p>View popup</p>;

            //return <iframe style={{width: '100%', height: '100%', borderWidth: 0}} src={url} ref={this.iframeRef} ></iframe>;
        }else if(this.state.token != ""){
            return <>
                <p>Got token. Redirecting to page.<br /> {this.state.token}</p>
                <Spinner></Spinner>
                <Redirect to="/"></Redirect>
            </>
        }{
            return <><p>Getting token...</p><Spinner></Spinner></>
        }

    }
}