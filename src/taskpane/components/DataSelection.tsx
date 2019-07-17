import * as React from 'react';
import { TextField, PrimaryButton } from 'office-ui-fabric-react';
import {Link} from 'react-router-dom';

       
    interface DataSelectionProps {
    }
    interface DataSelectionState {
        
    } 

export default class DataSelection extends React.Component<DataSelectionProps, DataSelectionState> {


    render() {

        return (
            <div className = 'ms-data-selection'>
             <TextField label="Choose Input Data" readOnly defaultValue="MVP - All Data Selected" />
             <TextField label="Choose Output Data" placeholder = "Example: C2"/>
            <br></br>
            
             <Link to = "/">
          <PrimaryButton style = {{width: 250, height: 30}} >
            <p> Generate Prediction </p>
          </PrimaryButton>
          </Link>
          
             </div>
        );
    }
}
