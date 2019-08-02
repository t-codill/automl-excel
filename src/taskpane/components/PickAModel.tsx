import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import {Link} from 'react-router-dom';
import { Button, MessageBar } from 'office-ui-fabric-react';
       
    interface PickAModelProps {
    }
    export interface PickAModelState {
        imageKey: string;
        buttonBool: boolean;
      
    } 

export default class PickAModel extends React.Component<PickAModelProps, PickAModelState> {
   
    
    constructor(props: {}) {
        super(props);
    
        this.state = {
          imageKey: '',
          buttonBool: true

        
        };
      }

    render() {

        return (
           <div className = "ms-PickAModel">
              <h1>Model Selection</h1>>
           
            

               <ChoiceGroup
          className="defaultChoiceGroup"
          defaultSelectedKey=""
          options={[
            {
              key: 'A',
              text: 'Option A',
              'data-automation-id': 'auto1'
            } as IChoiceGroupOption,
            {
              key: 'B',
              text: 'Option B'
            },
            {
              key: 'C',
              text: 'Option C',
              
            },
            {
              key: 'D',
              text: 'Option D',
              
            }
          ]}
          onChange={this._onChange}
          label="Choose a model to proceed."
          required={true}
        />
        <br></br>
            <MessageBar >
        Don't see your model? <Link to = "/CreateNewModel">Create a New Model</Link> or <Link to = "/">Launch the Azure Portal</Link>
             </MessageBar>

        <Link to = "/ModelAnalysis">
          <Button style = {{width: 250, height: 30}} disabled = {this.state.buttonBool}>
            <p> Select Model </p>
          </Button>
          </Link>
            </div>
        );
    }

    private _onChange = (_ev: React.FormEvent<HTMLInputElement>, option: any): void => {
        console.dir(option);
        this.setState({buttonBool: false})
      };
    }


