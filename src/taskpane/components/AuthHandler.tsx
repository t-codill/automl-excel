import * as React from 'react'
import { Spinner } from 'office-ui-fabric-react';

export default class AuthHandler extends React.Component<{}, {code: string}>{

    constructor(props){
        super(props);
        console.log(1);

        let searchParams = new URLSearchParams((new URL(window.location.toString())).search);
        console.log(2);
        if(!searchParams.has('code')){
            console.log('No code found!!!');
        }
        let code = searchParams.get("code")
        this.state = {
            code: searchParams.get("code")
        }
        console.log("parent = " + window.parent);
        window.opener.postMessage({code: code}, "*");
    }

    render(){
        return <Spinner></Spinner>
    }

}