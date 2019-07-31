import * as React from 'react';
import { ResponsiveMode, IconButton } from 'office-ui-fabric-react';
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react';
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from 'office-ui-fabric-react'
import { PrimaryButton, IButtonStyles } from 'office-ui-fabric-react'
import { TextField,  Stack, IStackProps } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'

export interface AppProps {
}

export interface AppState {
    isForecasting: boolean
    options: IDropdownOption[]
    nextDisabled: boolean
}

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            width: '30px', 
            paddingTop: '7px' }   
}

const dropdownStyle: Partial<IDropdownStyles> = {
    root: { paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '6px'}
};

const columnProps: Partial<IStackProps> = {
    styles: { root: { marginLeft: '8px',
                      marginRight: '8px',
                      marginTop: '6px',
                      paddingBottom: '10px'}
            }
}

const choiceGroupStyle: Partial<IChoiceGroupStyles> = {
    root: { paddingTop: '4px',
            paddingLeft: '8px',
            paddingBottom: '4px' }
}

const nextButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: '5px' }
}

export default class TypeOfProblem extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isForecasting: false, 
            nextDisabled: true,
            options: [{ key: 'Passenger Class', text: 'Passenger Class' },
            { key: 'Sex', text: 'Sex' },
            { key: 'Age', text: 'Age' },
            { key: 'Sibling/Spouse', text: 'Sibling/Spouse' },
            { key: 'Parent/Child', text: 'Parent/Child' },
            { key: 'lettFarePriceuce', text: 'FarePrice' },
            { key: 'Port Embarkation', text: 'Port Embarkation' },
            { key: 'Survived', text: 'Survived' }]
        };
    }

    //@ts-ignore
    private _onImageChoiceGroupChange(ev: React.SyntheticEvent<HTMLElement>, option: IChoiceGroupOption): void {
        if (option.key === 'classification') {
            this.setState({
                nextDisabled: false,
                isForecasting: false
            });
        } else if (option.key === 'forecasting') {
            this.setState({
                nextDisabled: true,
                isForecasting: true
            })
        } else {
            this.setState({
                nextDisabled: true,
                isForecasting: false
            })
        }
    }

    private _getErrorMessage(value: string): string {
        var n = Math.floor(Number(value));
        return value === '' || (String(n) === value && n >= 0) ? '' : 'Input must be a positive integer';
    }
     
    render() {
        // additional components (time series column, forecast horizon) for forecasting
        const forecastContent = this.state.isForecasting
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
                    <Link style={{position: 'absolute', left: 0}} to="/tutorial/outputfield">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Tutorial: Create New Model </span>
                </div>
                
                <p className='tutorial_text'> In this step, we need to specify the <b> type of problem </b> for our model. There are three types of problems. </p>
                <p className='tutorial_text'> <b>Classification models</b> are used to categorize data into multiple groups. <br></br>
                ex) filtering reviews as positive, neutral, or negative. </p>
                <p className='tutorial_text'> <b>Regression models</b> are used to predict a value. <br></br>
                ex) predicting automobile prices or sales revenue. </p>
                <p className='tutorial_text'>  <b>Forecasting models</b> use past observation to predict future observations. <br></br> 
                ex) predicting electricity consumption of a household. </p>
                <p className='tutorial_text'> Our task is to predict whether passangers survived or not, so it would be a <b>classification</b> problem. </p>
                
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
                
                <Link to='/tutorial/modeltraining'>
                    <PrimaryButton styles={nextButtonStyle} disabled={this.state.nextDisabled} text="next"/>
                </Link>
            </div>
        );
    }
}