
import * as React from 'react'
import { Spinner } from 'office-ui-fabric-react';

export interface IPageLoadProps {
    text?: string;
}

export const PageLoad = (props: IPageLoadProps) => {
    return <>
        <Spinner style={{marginTop: 100}}></Spinner>
        {props.text ? <p style={{textAlign: "center"}}>{props.text}</p> : <></>}
    </>
}