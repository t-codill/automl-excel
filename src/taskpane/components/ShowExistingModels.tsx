import * as React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton } from 'office-ui-fabric-react';
// import CreateNewModel from './CreateNewModel';
import {Link} from 'react-router-dom';

    interface SEMProps {
    }
    export interface SEMState {
        selectedItem?: { key: string | number | undefined };
    } 

      
     

export default class ShowExistingModels extends React.Component<SEMProps, SEMState> {
    public state: SEMState = {
        selectedItem: undefined
      };
    click = async () => {
        try {
          await Excel.run(async context => {
            /**
             * Insert your Excel code here
             */
            const range = context.workbook.getSelectedRange();
    
            // Read the range address
            range.load("address");
    
            await context.sync();
            console.log(`The range address was ${range.address}.`);
          });
        } catch (error) {
          console.error(error);
        }
      } 

    
    render() {
        const { selectedItem } = this.state;
        return (
            <div className = 'welcome'>
            
            <h2>Show Existing Models.</h2>
           
            <Dropdown
        label="Pre-Existing Model to Use"
        selectedKey={selectedItem ? selectedItem.key : undefined}
        onChange={this._onChange}
        placeholder="Select an option"
        options={[
          { key: 'apple', text: 'Apple' },
          { key: 'banana', text: 'Banana' },
          { key: 'grape', text: 'Grape' },
          { key: 'broccoli', text: 'Broccoli' },
          { key: 'carrot', text: 'Carrot' },
          { key: 'lettuce', text: 'Lettuce' }
        ]}
        styles={{ dropdown: { width: 300 } }}
      />

      
        <h3> Input Field</h3>
        <h4>MVP - All data selected.</h4>
        <h3> Output Field</h3>
        <Link to = "/CreateNewModel">
          <PrimaryButton>
            <p> Generate Prediction </p>
          </PrimaryButton>
          </Link>
        {/* <Route Path = "/ShowExistingModels"><PrimaryButton className = 'ms-welcome__action' buttonType = {ButtonType.hero} onClick = {this.click}><Link to = "/CreateNewModel"><CreateNewModel />Generate Prediction</Link> </PrimaryButton></Route> */}
            </div>
    
      
        );

    }


private _onChange = (_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    console.log(`Selection change: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);
    this.setState({ selectedItem: item });
  };
}

