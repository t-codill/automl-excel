import * as React from 'react';
import '../taskpane.css'
import { ResponsiveMode, IconButton } from 'office-ui-fabric-react';
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react';
import { PrimaryButton, IButtonStyles } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'

export interface AppProps {
}

export interface AppState {
    outputColumn: string
    options: IDropdownOption[]
}

const dropdownStyle: Partial<IDropdownStyles> = {
    root: { paddingLeft: '3px',
            paddingRight: '3px',
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

export default class TutorialTrain1 extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            outputColumn: '', 
            options: [{ key: 'Passenger Class', text: 'Passenger Class' },
            { key: 'Sex', text: 'Sex' },
            { key: 'Age', text: 'Age' },
            { key: 'Sibling/Spouse', text: 'Sibling/Spouse' },
            { key: 'Parent/Child', text: 'Parent/Child' },
            { key: 'lettFarePriceuce', text: 'FarePrice' },
            { key: 'Port Embarkation', text: 'Port Embarkation' },
            { key: 'Survived', text: 'Survived' }]
        };
    };
    
    //@ts-ignore
    private _onDropDownChange(ev: React.SyntheticEvent<HTMLElement>, option: IDropDownOption): void {
        this.setState({
            outputColumn: option.key
        });
    }

    render() {
        return (
            <div>
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorialimportdata">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Tutorial: Create New Model </span>
                </div>
                <p className='tutorial_text'> Now, we will start creating a model. </p>
                <p className='tutorial_text'> First, specify the <b>output field</b>, the value we are trying to predict. In this case, the <b>Survived</b> column. </p>
                <div className='tutorial-block'>
                    <Dropdown 
                        placeholder="Select the output field" 
                        label='What do you want to predict?' 
                        options={this.state.options} 
                        responsiveMode={ResponsiveMode.xLarge} 
                        onChange={this._onDropDownChange.bind(this)} 
                        errorMessage={this.state.outputColumn !== 'Survived' ? 'Select the correct output column' : undefined} styles={dropdownStyle}/>
                </div>
                <Link to='/tutorialTrain2'>
                    <PrimaryButton styles={nextButtonStyle} text="next"/>
                </Link>
            </div>
        );
    }
}