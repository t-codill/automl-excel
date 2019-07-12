import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react';
import {Link} from 'react-router-dom';

       
    interface CreateNewModelProps {
    }
    interface CreateNewModelState {
        
    } 

export default class CreateNewModel extends React.Component<CreateNewModelProps, CreateNewModelState> {


    render() {

        return (
            <div className = 'create new model'>
             
             <Link to = "/Training">
          <PrimaryButton>
            <p> Train </p>
          </PrimaryButton>
          </Link>
            </div>
        );
    }

}


