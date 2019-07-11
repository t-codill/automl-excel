import * as React from 'react';
import '../taskpane.css'
import { ResponsiveMode } from 'office-ui-fabric-react';
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react';
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from 'office-ui-fabric-react'
import { PrimaryButton, IconButton, IButtonStyles } from 'office-ui-fabric-react'
import { TextField,  Stack, IStackProps } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom';

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

const trainButtonStyles: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

export default class Train extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            algorithm: 'classification', 
            headers: [],
            options: []
        };
        // this.updateHeader();
    };

    // private updateHeader() {
    //     Excel.run(async context => {
    //         var sheet = context.workbook.worksheets.getActiveWorksheet();
    //         var range = sheet.getUsedRange();
    //         range.load("values")

    //         await context.sync();
    //         this.setState ({
    //             headers: range.values[0],
    //             options: range.values[0].map(x => {
    //                 return{'key': x, 'text': x};
    //             })
    //         })   
    //         console.log(this.state.headers)
    //     });
    // }

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
                       <TextField label="How many periods forward to forcast?" onGetErrorMessage={this._getErrorMessage} placeholder="Enter forecast horizon"/>
                    </Stack>
                </div>
            :   null;

        return (
            <div>
                <div style={{position: 'relative', height: 35, textAlign: 'center'}} className="ms-train__header_block">
                    <Link style={{position: 'absolute', left: 0}} to="/">
                    <IconButton style={{color: 'white', display: 'inline-block', width: '30px', paddingTop: '7px'}} iconProps={{ iconName: 'ChromeBack'}} ariaLabel="back"/></Link>
                    <span className='ms-train__header'> Create New Model </span>
                </div>
                <div className='ms-train__refresh'>
                    <IconButton  size={5} iconProps={{ iconName: 'refresh'}} title="refresh" ariaLabel="refresh" /*onClick={this.updateHeader.bind(this)}*//>
                    <span className='ms-train__refresh_text'> refresh </span>
                </div>
                <Dropdown placeholder="Select the output column" label='What value do you want to predict?' options={this.state.options} responsiveMode={ResponsiveMode.xLarge} styles={dropdownStyles} />
                <ChoiceGroup label='Select the type of problem' onChange={this._onImageChoiceGroupChange.bind(this)} styles={choiceGroupStyle} options={[
                    {key: 'classification', text: 'Classification', imageSrc: '/assets/classification.png', selectedImageSrc: '/assets/classificationSelected.png', imageSize: { width: 40, height: 38}},
                    {key: 'regression', text: 'Regression', imageSrc: '/assets/regression.png', selectedImageSrc: '/assets/regressionSelected.png', imageSize: { width: 36, height: 38}},
                    {key: 'forecasting', text: 'Forecasting', imageSrc: '/assets/forecasting.png', selectedImageSrc: '/assets/forecastingSelected.png', imageSize: { width: 36, height: 38}}]}/>
                { forecastContent }
                <PrimaryButton styles={trainButtonStyles} data-automation-id="train" allowDisabledFocus={true} text="train" />
                <Link to='/train'>Train</Link><br></br>
                <Link to='/run'>Run</Link><br></br>
                <Link to='/welcome'>Welcome</Link><br></br>
                <Link to='/tutorialtrain'>Tutorial: Create New Model</Link>
            </div>
        );
    }
}