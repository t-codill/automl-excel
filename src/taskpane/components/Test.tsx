import * as React from 'react';
//import { IDropdownOption } from 'office-ui-fabric-react';
//import { PageLoadingSpinner } from "../../automl/components/Progress/PageLoadingSpinner";
import { AppContext } from './AppContext';



export interface AppState {
  //options: IDropdownOption[];
}

export default class Test extends React.Component<{}, AppState> {
    static contextType = AppContext;

    constructor(props, context) {
        super(props, context);
        this.state = {}
        /*this.state = {
            options: []
        };*/
        console.log(this.context);
    };

    render() {
        return <p></p>;
    }
}