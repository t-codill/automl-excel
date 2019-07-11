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
    headers: any[]
    options: IDropdownOption[]
}

const dropdownStyles: Partial<IDropdownStyles> = {
    root: { paddingLeft: '3px',
            paddingRight: '3px',
            paddingTop: '6px'}
};

const columnProps: Partial<IStackProps> = {
    styles: { root: { marginLeft: '3px',
                      marginRight: '3px',
                      marginTop: '6px'}
            }
}

const choiceGroupStyle: Partial<IChoiceGroupStyles> = {
    root: { paddingTop: '6px',
            paddingLeft: '3px' }
}

const buttonStyles: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

export default class TutorialTrain extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            algorithm: 'classification', 
            headers: [],
            options: []
        };
    };

    private _updateHeader() {
        this.setState ({
            headers: ["Passenger Class", "Sex", "Age", "Sibling/Spouse", "Parent/Child", "FarePrice", "Port Embarkation", "Survived"],
            options: [{ key: 'Passenger Class', text: 'Passenger Class' },
                    { key: 'Sex', text: 'Sex' },
                    { key: 'Age', text: 'Age' },
                    { key: 'Sibling/Spouse', text: 'Sibling/Spouse' },
                    { key: 'Parent/Child', text: 'Parent/Child' },
                    { key: 'lettFarePriceuce', text: 'FarePrice' },
                    { key: 'Port Embarkation', text: 'Port Embarkation' },
                    { key: 'Survived', text: 'Survived' }]
        })
    }

    private _createTable() {
        Excel.run(async context => {
            var currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
            var wineTable = currentWorksheet.tables.add("A1:H1", true /*hasHeaders*/);
            wineTable.name = "WineTable";
    
            wineTable.getHeaderRowRange().values =
            [["Passenger Class", "Sex", "Age", "Sibling/Spouse", "Parent/Child", "FarePrice", "Port Embarkation", "Survived"]];
        
            wineTable.rows.add(null /*add at the end*/, [
                ["3", "female", "38", "1", "5", "31.3875", "S", "1"],
                ["3", "male", "3", "4", "2", "31.3875", "S", "1"],
                ["3", "male", "25", "1", "0", "17.8", "S", "0"],
                ["2", "female", "30", "0", "0", "12.35", "Q", "1"],
                ["2", "male", "31", "1", "1", "37.0042", "C", "0"],
                ["2", "female", "24", "1", "0", "27.7208", "C", "1"],
                ["1", "female", "60", "1", "0", "75.25", "C", "1"],
                ["1", "male", "17", "0", "2", "110.8833", "C", "1"],
                ["2", "female", "36", "0", "3", "39", "S", "1"],
                ["1", "male", "45", "0", "0", "26.55", "S", "1"],
                ["1", "male", "30", "0", "0", "27.75", "C", "0"],
                ["1", "male", "64", "1", "4", "263", "S", "0"],
                ["1", "female", "33", "1", "0", "90", "Q", "1"],
                ["1", "male", "58", "0", "2", "113.275", "C", "0"],
                ["1", "female", "19", "0", "2", "26.2833", "S", "1"],
                ["1", "male", "64", "0", "0", "26", "S", "0"],
                ["1", "female", "39", "0", "0", "108.9", "C", "1"],
                ["2", "female", "34", "1", "1", "32.5", "S", "1"],
                ["2", "female", "27", "1", "0", "13.8583", "C", "1"],
                ["2", "female", "30", "1", "0", "13.8583", "C", "1"],
                ["2", "male", "23", "0", "0", "13", "S", "0"],
                ["2", "male", "35", "0", "0", "12.35", "Q", "0"],
                ["2", "female", "45", "0", "0", "13.5", "S", "1"],
                ["2", "male", "57", "0", "0", "12.35", "Q", "0"],
                ["2", "male", "39", "0", "0", "26", "S", "0"],
                ["2", "male", "16", "0", "0", "10.5", "S", "0"],
                ["2", "male", "62", "0", "0", "9.6875", "Q", "0"],
                ["2", "male", "32", "1", "0", "30.0708", "C", "0"],
                ["2", "female", "14", "1", "0", "30.0708", "C", "1"],
                ["3", "female", "13", "0", "0", "7.2292", "C", "1"],
                ["3", "male", "20", "0", "0", "7.225", "C", "0"],
                ["3", "male", "32", "1", "0", "15.85", "S", "0"],
                ["3", "female", "33", "3", "0", "15.85", "S", "1"],
                ["3", "male", "32", "0", "0", "7.925", "S", "0"],
                ["3", "male", "34", "0", "0", "6.4375", "C", "0"]
            ]);
            wineTable.columns.getItemAt(5).getRange().numberFormat = [['0.00']];
            wineTable.getRange().format.autofitColumns();
            wineTable.getRange().format.autofitRows();
            
            await context.sync();
        })
    }

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
                    <Dropdown placeholder="Select the time column" label='Which column holds the timestamps?' options={this.state.options} responsiveMode={ResponsiveMode.xLarge} styles={dropdownStyles} />
                    <Stack {...columnProps}>
                       <TextField label="How many periods forward are you forecasting?" onGetErrorMessage={this._getErrorMessage}/>
                    </Stack>
                </div>
            :   null;

        return (
            <div>
                <div style={{position: 'relative', height: 35, textAlign: 'center'}} className="ms-train__header_block">
                    <Link style={{position: 'absolute', left: 0}} to="/">
                    <IconButton style={{color: 'white', display: 'inline-block', width: '30px', paddingTop: '12px'}} iconProps={{ iconName: 'ChromeBack'}} ariaLabel="back"/></Link>
                    <span className='ms-train__header'> Tutorial: Create New Model </span>
                </div>
                <div> 
                {/* <label> First, we will import a sample data. </label> */}
                <PrimaryButton styles={buttonStyles} data-automation-id="import_data" allowDisabledFocus={true} text="Import sample data" onClick={(event) => {this._createTable(); this._updateHeader();}} />
                </div>
                <Dropdown placeholder="Select the output column" label='What do you want to predict?' options={this.state.options} responsiveMode={ResponsiveMode.xLarge} styles={dropdownStyles} />
                <ChoiceGroup label='Select the type of problem' onChange={this._onImageChoiceGroupChange.bind(this)} styles={choiceGroupStyle} options={[
                    {key: 'classification', text: 'Classification', imageSrc: '/assets/classification.png', selectedImageSrc: '/assets/classificationSelected.png', imageSize: { width: 40, height: 38}},
                    {key: 'regression', text: 'Regression', imageSrc: '/assets/regression.png', selectedImageSrc: '/assets/regressionSelected.png', imageSize: { width: 36, height: 38}},
                    {key: 'forecasting', text: 'Forecasting', imageSrc: '/assets/forecasting.png', selectedImageSrc: '/assets/forecastingSelected.png', imageSize: { width: 36, height: 38}}]}/>
                { forecastContent }
                <PrimaryButton styles={buttonStyles} data-automation-id="train" allowDisabledFocus={true} text="train" />
            </div>
        );
    }
}