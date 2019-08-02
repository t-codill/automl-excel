import * as React from 'react';
import { Spinner } from 'office-ui-fabric-react';

const clientId = "2d854c46-8b8e-4128-9329-613e1039c582";
const redirectUrl = `https://login.microsoftonline.com/common/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A8080/taskpane/logindialog&response_mode=query&resource=https%3A%2F%2Fmanagement.core.windows.net%2F`;

interface DialogState {
    gotCode: boolean;
    code: string;
}

export class Dialog extends React.Component<{}, DialogState>{

    constructor(props){
        super(props);
        //window.location.href = this.url;
        let searchParams = new URLSearchParams((new URL(window.location.toString())).search);
        if(!searchParams.has('code')){

            window.location.replace(redirectUrl);
            this.state = {
                gotCode: false,
                code: null
            }
        }else{
            let code = searchParams.get("code");
            //window.opener.postMessage(code);
            this.state = {
                gotCode: true,
                code: code
            }
            Office.context.ui.messageParent(code);
        }
    }

    render(){
        return <Spinner></Spinner>
        
    }

}