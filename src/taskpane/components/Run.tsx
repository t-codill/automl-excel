import * as React from 'react';
import { Dropdown, IDropdownOption, ResponsiveMode } from 'office-ui-fabric-react/lib/Dropdown';

interface SEMProps {
}
export interface SEMState {
    selectedItem?: { key: string | number | undefined };
} 

export default class Run extends React.Component<SEMProps, SEMState> {
    public state: SEMState = {
        selectedItem: undefined
      }; 


    render() {
        const { selectedItem } = this.state;

        const options = [
          { key: 'apple', text: 'Apple' },
          { key: 'banana', text: 'Banana' },
          { key: 'grape', text: 'Grape' },
          { key: 'broccoli', text: 'Broccoli' },
          { key: 'carrot', text: 'Carrot' },
          { key: 'lettuce', text: 'Lettuce' }
        ];

        return (
          <div className = 'welcome center'>
          
            <h2>Show Existing Models.</h2>
            
            <Dropdown
              label="Pre-Existing Model to Use"
              selectedKey={selectedItem ? selectedItem.key : undefined}
              onChange={this._onChange}
              placeholder="Select an option"
              options={options}
              styles={{ dropdown: { width: 300 } }} responsiveMode={ResponsiveMode.xLarge}
            />

        
            <h3> Input Field</h3>
            <h3> Output Field</h3>
            <p>{window.localStorage.getItem('test')}</p>
          </div>
        );

    }


private _onChange = (_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    console.log(`Selection change: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);
    this.setState({ selectedItem: item });
  };
}