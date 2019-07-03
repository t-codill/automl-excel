import * as React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';


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
        <h3> Output Field</h3>
            </div>
        );

    }


private _onChange = (_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    console.log(`Selection change: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);
    this.setState({ selectedItem: item });
  };
}

