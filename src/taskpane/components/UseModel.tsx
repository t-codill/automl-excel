import * as React from 'react';
import { Dropdown, IDropdownStyles, ResponsiveMode } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton, IconButton, IButtonStyles } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';

interface SEMProps {
}

export interface SEMState {
    selectedItem?: { key: string | number | undefined };
} 

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            width: '30px', 
            paddingTop: '7px' }   
}

const dropdownStyle: Partial<IDropdownStyles> = {
    root: { paddingLeft: '3px',
            paddingRight: '3px',
            paddingTop: '6px' }
};

const buttonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

export default class UseModel extends React.Component<SEMProps, SEMState> {
    public state: SEMState = {
        selectedItem: undefined
      }; 


    render() {
        const { selectedItem } = this.state;

        const options = [
          { key: 'Titanic Passanger Survival', text: 'Titanic Passanger Survival' }
        ];

        return (
            <div>          
                <div style={{position: 'relative', height: 35, textAlign: 'center'}} className="header_block">
                    <Link style={{position: 'absolute', left: 0}} to="/" >
                    <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}} ariaLabel="back"/></Link>
                    <span className='header_text'> Use Existing Model </span>
                </div>
                <div>
                    <Dropdown
                        label="Which model would you like to use?"
                        selectedKey={selectedItem ? selectedItem.key : undefined}
                        placeholder="Select model to use"
                        options={options}
                        styles={dropdownStyle}
                        responsiveMode={ResponsiveMode.xLarge} />      
                    <p className='text'> Input Field </p>
                    <p className='text'> Output Field </p>
                    <Link to = "/CreateNewModel">
                        <PrimaryButton styles={buttonStyle} text="Generate Predictions" />
                    </Link>
                </div>
            </div>
        );
    }
}