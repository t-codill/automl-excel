import * as React from 'react';
import '../taskpane.css'
import { ResponsiveMode } from 'office-ui-fabric-react';
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react';
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from 'office-ui-fabric-react'
import { PrimaryButton, IconButton, IButtonStyles } from 'office-ui-fabric-react'
import { TextField,  Stack, IStackProps } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { AppContext } from './AppContext';
import { AzureMachineLearningWorkspacesModels } from '@azure/arm-machinelearningservices';
import { PageLoad } from './PageLoad';

export interface AppProps {
}

export interface AppState {
    algorithm: string
    headers: any[]
    options: IDropdownOption[]
}

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: '90%' },
    root: { textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            paddingTop: '5px', 
            paddingBottom: '6px' },
    label: { fontFamily: "Segoe UI",
             fontWeight: '600' }
};

const columnProps: Partial<IStackProps> = {
    styles: { root: { width: '90%', 
                      textAlign: 'center', 
                      marginLeft: 'auto', 
                      marginRight: 'auto'}
            }
}

const choiceGroupStyle: Partial<IChoiceGroupStyles> = {
    root: { textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            paddingTop: '5px' },
    label: { fontFamily: "Segoe UI",
             fontWeight: '600' }
}

const trainButtonStyles: Partial<IButtonStyles> = {
    root: { marginTop: '20px',
            display: 'block',
            marginLeft: 'auto', 
            marginRight: 'auto' }
}

export default class Train extends React.Component<AppProps, AppState> {
    static contextType = AppContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            algorithm: 'classification', 
            headers: [],
            options: []
        };
    };
    
    async componentDidMount(){
        if(this.context.workspaceList === null)
            this.context.updateWorkspaceList();
    }
    

    updateHeader() {
        Excel.run(async context => {
            var sheet = context.workbook.worksheets.getActiveWorksheet();
            var range = sheet.getUsedRange();
            range.load("values")

            await context.sync();
            this.setState ({
                headers: range.values[0],
                options: range.values[0].map(x => {
                    return{'key': x, 'text': x};
                })
            })   
            console.log(this.state.headers)
        });
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
        
        if(this.context.workspaceList === null){
            return <PageLoad text="Waiting for workspace list" />;
        }

        this.context.workspaceList.map((workspace: AzureMachineLearningWorkspacesModels.Workspace) => { return {
            key: workspace.id,
            value: workspace.friendlyName,
            text: workspace.friendlyName
        }});

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
                <div className='ms-train__refresh'>
                    <IconButton  size={5} iconProps={{ iconName: 'refresh'}} title="refresh" ariaLabel="refresh" /*onClick={this.updateHeader.bind(this)}*//>
                    <span className='ms-train__refresh_text'> Refresh </span>
                </div>
                <Dropdown placeholder="Select the output column" label='What do you want to predict?' options={this.state.options} responsiveMode={ResponsiveMode.xLarge} styles={dropdownStyles} />
                <ChoiceGroup label='Select Type of Problem' onChange={this._onImageChoiceGroupChange.bind(this)} styles={choiceGroupStyle} options={[
                    {key: 'classification', text: 'Classification', imageSrc: '/assets/classification.png', selectedImageSrc: '/assets/classificationSelected.png', imageSize: { width: 40, height: 40}},
                    {key: 'regression', text: 'Regression', imageSrc: '/assets/regression.png', selectedImageSrc: '/assets/regressionSelected.png', imageSize: { width: 40, height: 40}},
                    {key: 'forecasting', text: 'Forecasting', imageSrc: '/assets/forecasting.png', selectedImageSrc: '/assets/forecastingSelected.png', imageSize: { width: 40, height: 40}}]}/>
                { forecastContent }
                <PrimaryButton styles={trainButtonStyles} data-automation-id="train" allowDisabledFocus={true} text="Train" />
                <Link to="/modelanalysis">Model Analysis</Link><br />
                <Link to="/training">Training</Link><br />
                <Link to="/login">Login</Link><br />
                
                <Link to='/tutorialimportdata'>Tutorial: Prepare Data</Link><br></br>
                <Link to='/tutorialtrain1'>Tutorial1: Create New Model</Link><br></br>
                <Link to='/tutorialtrain2'>Tutorial2: Create New Model</Link><br></br>
                <Link to='/tutorialtraining'>Tutorial: Trainig in Progress</Link><br></br>
            </div>
        );
    }
}