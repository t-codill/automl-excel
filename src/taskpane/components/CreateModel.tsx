import * as React from 'react'
import '../taskpane.css'
import { ResponsiveMode } from 'office-ui-fabric-react'
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react'
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from 'office-ui-fabric-react'
import { PrimaryButton, IconButton, IButtonStyles } from 'office-ui-fabric-react'
import { TextField, Stack, IStackProps } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'

export interface AppProps {
}

export interface AppState {
    algorithm: string
    options: IDropdownOption[]
    headers: string[]
}

const dropdownStyle: Partial<IDropdownStyles> = {
    root: { paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '6px'}
};

const columnProps: Partial<IStackProps> = {
    styles: { root: { marginLeft: '8px',
                      marginRight: '8px',
                      marginTop: '6px'}
            }
}

const choiceGroupStyle: Partial<IChoiceGroupStyles> = {
    root: { paddingTop: '6px',
            paddingLeft: '8px' }
}

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            width: '30px', 
            paddingTop: '7px' }   
}

const trainButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

export default class CreateModel extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            algorithm: 'classification', 
            options: [],
            headers: []
        };
        this.updateHeader = this.updateHeader.bind(this);
        this.createEventListener();
        this.updateHeader(0);
    };

    private createEventListener() {
        Excel.run(async context => {
            var worksheet = context.workbook.worksheets.getActiveWorksheet();
            worksheet.onChanged.add(this.updateHeader);
            await context.sync()
        });
    }

    private updateHeader(event) {
        return Excel.run(async function(context) {
            var sheet = context.workbook.worksheets.getActiveWorksheet();
            var range = sheet.getUsedRange();
            range.load("values")

            return context.sync()
                .then(function() {
                    this.setState ({
                        headers: range.values[0],
                        options: range.values[0].map(x => {return{'key': x, 'text': x};})
                    }) 
                    console.log(this.state.headers)
                }.bind(this))
        }.bind(this))
    }

    //@ts-ignore
    private _onImageChoiceGroupChange(ev: React.SyntheticEvent<HTMLElement>, option: IChoiceGroupOption) {
        this.setState({
            algorithm: option.key
        });
    }

    private _getErrorMessage(value: string) {
        var n = Math.floor(Number(value));
        return value === '' || (String(n) === value && n >= 0) ? '' : 'Input must be a positive integer';
    }
    
    render() {
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
                    <Link style={{position: 'absolute', left: 0}} to="/">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/> 
                    </Link>
                    <span className='header_text'> Create New Model </span>
                </div>
                <Dropdown 
                    placeholder="Select the output field" 
                    label='What value do you want to predict?' 
                    options={this.state.options} 
                    responsiveMode={ResponsiveMode.xLarge} 
                    styles={dropdownStyle} />
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
                <Link to="/modeltraining">
                    <PrimaryButton styles={trainButtonStyle} text="create" />
                </Link>
                {/* <div>
                    <br></br> <br></br> <br></br> <br></br> <br></br>
                    <Link to='/createmodel'>Create Model</Link><br></br>
                    <Link to='/modeltraining'>Model Training</Link><br></br>
                    <Link to='/usemodel'>Use Model</Link><br></br>
                    <Link to='/tutorial/importdata'>Tutorial: Prepare Data</Link><br></br>
                    <Link to='/tutorial/outputfield'>Tutorial: Create New Model</Link><br></br>
                    <Link to='/tutorial/modeltraining'>Tutorial: Model Training</Link><br></br>
                    <Link to='/ModelAnalysis'>Model Analysis</Link><br></br>
                    <Link to='/Analysis'>Analysis</Link>
                </div> */}
            </div>
        );
    }
}