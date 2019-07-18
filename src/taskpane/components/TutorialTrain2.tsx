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
        const forecastContent = this.state.algorithm === 'forecasting' 
            ?   <div>
                    <Dropdown placeholder="Select the time column" label='Which column holds the timestamps?' options={this.state.options} responsiveMode={ResponsiveMode.xLarge} styles={dropdownStyle} />          
                    <Stack {...columnProps}>
                       <TextField label="How many periods forward are you forecasting?" onGetErrorMessage={this._getErrorMessage} placeholder='Enter forcast horizon'/>
                    </Stack>
                </div>
            :   null;

        return (
            <div>
                <div style={{position: 'relative', height: 35, textAlign: 'center'}} className="ms-train__header_block">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorialtrain1">
                    <IconButton style={{color: 'white', display: 'inline-block', width: '30px', paddingTop: '7px'}} iconProps={{ iconName: 'ChromeBack'}} ariaLabel="back"/></Link>
                    <span className='ms-train__header'> Tutorial: Create New Model </span>
                </div>
                <Dropdown placeholder="Select the output column" label='What do you want to predict?' options={this.state.options} defaultSelectedKey='Survived' disabled={true} responsiveMode={ResponsiveMode.xLarge} styles={dropdownStyle} />
                <p className='ms-tutorial__text'> In this step, we need to specify the <b> type of problem </b> for our model. There are three types of problems. </p>
                <p className='ms-tutorial__text'> 1) <b>Classification models</b> are used to categorize data into multiple groups. <br></br>
                ex) filtering reviews as positive, neutral, or negative. </p>
                <p className='ms-tutorial__text'> 2) <b>Regression models</b> are used to predict a value. <br></br>
                ex) predicting automobile prices or sales deal revenue. </p>
                <p className='ms-tutorial__text'> 3) <b>Forecasting models</b> use past observation to predict future observations. <br></br> 
                ex) predicting electricity consumption of a household over 2 years. </p>
                <p className='ms-tutorial__text'> Our task is to predict whether passangers survived or not, so it would be a classification problem. </p>
                <div className='ms-tutorial'>
                    <ChoiceGroup label='Select the type of problem' onChange={this._onImageChoiceGroupChange.bind(this)} styles={choiceGroupStyle} options={[
                        {key: 'classification', text: 'Classification', imageSrc: '/assets/classification.png', selectedImageSrc: '/assets/classificationSelected.png', imageSize: { width: 40, height: 38}},
                        {key: 'regression', text: 'Regression', imageSrc: '/assets/regression.png', selectedImageSrc: '/assets/regressionSelected.png', imageSize: { width: 36, height: 38}},
                        {key: 'forecasting', text: 'Forecasting', imageSrc: '/assets/forecasting.png', selectedImageSrc: '/assets/forecastingSelected.png', imageSize: { width: 36, height: 38}}]}/>
                    { forecastContent }
                </div>
                <Link to='/tutorialtraining'><PrimaryButton styles={nextButtonStyle} data-automation-id="next" allowDisabledFocus={true} text="next" /></Link>
            </div>
        );
    }
}