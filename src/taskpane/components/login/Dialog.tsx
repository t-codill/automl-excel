import * as React from 'react';

const clientId = "2d854c46-8b8e-4128-9329-613e1039c582";


export class DialogOpen extends React.Component<{}, {}>{
    url: string = `https://login.microsoftonline.com/common/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080/taskpane/auth&response_mode=query`;

    constructor(props){
        super(props);
        //window.location.href = this.url;
    }

    render(){
        return <p>Redirecting...</p>
    }

}