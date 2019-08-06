import * as React from 'react';
import { ResponsiveMode, IconButton } from 'office-ui-fabric-react';
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react';
import { PrimaryButton, IButtonStyles } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'

export interface AppProps {
}

export interface AppState {
    options: IDropdownOption[]
    nextDisabled: boolean
}

const dropdownStyle: Partial<IDropdownStyles> = {
    root: { paddingLeft: '5px',
            paddingRight: '5px',
            paddingTop: '3px',
            paddingBottom: '10px'}
};

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            width: '30px', 
            paddingTop: '7px' }   
}

const nextButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: '5px' }
}

export default class OutputField extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            nextDisabled: true,
            options: [{ key: 'passenger class', text: 'passenger class' },
            { key: 'name', text: 'name' },
            { key: 'sex', text: 'sex' },
            { key: 'age', text: 'age' },
            { key: 'sibling/spouse', text: 'sibling/spouse' },
            { key: 'parent/child', text: 'parent/child' },
            { key: 'ticket', text: 'ticket' },
            { key: 'fare', text: 'fare' },
            { key: 'embarked', text: 'embarked' },
            { key: 'home', text: 'home' },
            { key: 'survived', text: 'survived' }]
        };
    };
    
    //@ts-ignore
    private _onDropDownChange(ev: React.SyntheticEvent<HTMLElement>, option: IDropDownOption): void {
        if (option.key === 'survived') {
            this.setState({
                nextDisabled: false
            });
        }
    }

    render() {
        return (
            <div>
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorial/importdata">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Tutorial: Create New Model </span>
                </div>
                <p className='tutorial_text'> Now, we will start creating a model. </p>
                <p className='tutorial_text'> First, specify the <b>output field</b>, the value we are trying to predict. In this case, the <b>survived</b> column. </p>
                <div className='tutorial-block'>
                    <Dropdown 
                        placeholder="Select the output field" 
                        label='What do you want to predict?' 
                        options={this.state.options} 
                        responsiveMode={ResponsiveMode.xLarge} 
                        onChange={this._onDropDownChange.bind(this)} 
                        styles={dropdownStyle}/>
                </div>
                <Link to='/tutorial/typeofproblem'>
                    <PrimaryButton styles={nextButtonStyle} disabled={this.state.nextDisabled} text="next"/>
                </Link>
            </div>
        );
    }
}