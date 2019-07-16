import * as React from 'react';
import '../taskpane.css'
import { ResponsiveMode, IconButton } from 'office-ui-fabric-react';
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react';
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from 'office-ui-fabric-react'
import { PrimaryButton, IButtonStyles } from 'office-ui-fabric-react'
import { TextField,  Stack, IStackProps } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'

export interface AppProps {
}

export interface AppState {
    algorithm: string
    options: IDropdownOption[]
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
            paddingTop: '10px' }
};

const columnProps: Partial<IStackProps> = {
    styles: { root: { marginLeft: '3px',
                      marginRight: '3px',
                      marginTop: '6px'}
            }
}

const choiceGroupStyle: Partial<IChoiceGroupStyles> = {
    root: { paddingTop: '6px',
            paddingLeft: '3px',
            paddingBottom: '10px'}
}

const nextButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: '5px' }
}

export default class TutorialTrain2 extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            algorithm: 'classification', 
            options: [{ key: 'Passenger Class', text: 'Passenger Class', disabled: true },
            { key: 'Sex', text: 'Sex', disabled: true },
            { key: 'Age', text: 'Age', disabled: true },
            { key: 'Sibling/Spouse', text: 'Sibling/Spouse', disabled: true },
            { key: 'Parent/Child', text: 'Parent/Child', disabled: true },
            { key: 'lettFarePriceuce', text: 'FarePrice', disabled: true },
            { key: 'Port Embarkation', text: 'Port Embarkation', disabled: true },
            { key: 'Survived', text: 'Survived' }]
        };
    };

    //@ts-ignore
    private _onImageChoiceGroupChange(ev: React.SyntheticEvent<HTMLElement>, option: IChoiceGroupOption): void {
        this.setState({
            algorithm: option.key
        });
    }

    private _getErrorMessage(value: string): string {
        var n = Math.floor(Number(value));
        return value === '' || (String(n) === value && n >= 0) ? '' : 'Input must be a positive integer';
    }
     
    render() {
        // additional components (time series column, forecast horizon) for forecasting
        const forecastContent = this.state.algorithm === 'forecasting' 
            ?   <div>
                    <Dropdown 
                        placeholder="Select the time column" 
                        label='Which column holds the timestamps?' 
                        options={this.state.options} 
                        responsiveMode={ResponsiveMode.xLarge} 
                        styles={dropdownStyle} />
                    <Stack {...columnProps}>
                        <TextField 
                            label="How many periods forward to forcast?" 
                            onGetErrorMessage={this._getErrorMessage} 
                            placeholder="Enter forecast horizon"/>
                    </Stack>
                </div>
            :   null;

        return (
            <div>
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorialtrain1">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Tutorial: Create New Model </span>
                </div>
                <Dropdown 
                    label='What value do you want to predict?' 
                    options={this.state.options} 
                    responsiveMode={ResponsiveMode.xLarge} 
                    styles={dropdownStyle}/>
                <p className='tutorial_text'> In this step, we need to specify the <b> type of problem </b> for our model. There are three types of problems. </p>
                <p className='tutorial_text'> 1) <b>Classification models</b> are used to categorize data into multiple groups. <br></br>
                ex) filtering reviews as positive, neutral, or negative. </p>
                <p className='tutorial_text'> 2) <b>Regression models</b> are used to predict a value. <br></br>
                ex) predicting automobile prices or sales deal revenue. </p>
                <p className='tutorial_text'> 3) <b>Forecasting models</b> use past observation to predict future observations. <br></br> 
                ex) predicting electricity consumption of a household over 2 years. </p>
                <p className='tutorial_text'> Our task is to predict whether passangers survived or not, so it would be a classification problem. </p>
                <div className='tutorial-block'>
                    <ChoiceGroup 
                        label='Select the type of problem' 
                        onChange={this._onImageChoiceGroupChange.bind(this)} 
                        styles={choiceGroupStyle} 
                        options={[
                            { 
                                key: 'classification', 
                                text: 'Classification', 
                                imageSrc: '/assets/classification.png', 
                                selectedImageSrc: '/assets/classificationSelected.png', 
                                imageSize: { width: 40, height: 38}
                            },
                            {
                                key: 'regression', 
                                text: 'Regression', 
                                imageSrc: '/assets/regression.png', 
                                selectedImageSrc: '/assets/regressionSelected.png', 
                                imageSize: { width: 36, height: 38}
                            },
                            {
                                key: 'forecasting', 
                                text: 'Forecasting', 
                                imageSrc: '/assets/forecasting.png', 
                                selectedImageSrc: '/assets/forecastingSelected.png', 
                                imageSize: { width: 36, height: 38}
                            }
                        ]}/>
                    { forecastContent }
                </div>
                <Link to='/tutorialtraining'>
                    <PrimaryButton styles={nextButtonStyle} text="next"/>
                </Link>
            </div>
        );
    }
}