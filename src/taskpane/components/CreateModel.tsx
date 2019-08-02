import * as React from 'react'
import '../taskpane.css'
import { ResponsiveMode, Checkbox } from 'office-ui-fabric-react'
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react'
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from 'office-ui-fabric-react'
import { PrimaryButton, IconButton, IButtonStyles } from 'office-ui-fabric-react'
import { TextField, Stack, IStackProps } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { AzureMachineLearningWorkspacesModels, AzureMachineLearningWorkspaces } from '@azure/arm-machinelearningservices';
import { AppContext } from './AppContext';
import { PageLoad } from './PageLoad';
import { updateState } from './util';
import { ResourceGroup } from '@azure/arm-resources/esm/models';
import { ResourceManagementModels } from '@azure/arm-resources';
import { TokenCredentials } from '@azure/ms-rest-js';
import { MachineLearningComputeCreateOrUpdateResponse } from '@azure/arm-machinelearningservices/esm/models';

export interface AppProps {
}

export interface AppState {
    algorithm: string
    options: IDropdownOption[]
    headers: string[],
    defaultSelectedWorkspaceOption: any,
    workspaceOptions: IDropdownOption[],
    workspaceChoice: AzureMachineLearningWorkspacesModels.Workspace,
    createNewWorkspace: boolean,
    resourceGroupOptions: IDropdownOption[],
    resourceGroupChoice: string,
    newWorkspaceName: string
}

const dropdownStyle: Partial<IDropdownStyles> = {
    root: { paddingLeft: '5px',
            paddingRight: '5px',
            paddingTop: '6px'}
};

const columnProps: Partial<IStackProps> = {
    styles: { root: { marginLeft: '5px',
                      marginRight: '5px',
                      marginTop: '6px'}
            }
}

const choiceGroupStyle: Partial<IChoiceGroupStyles> = {
    root: { paddingTop: '6px',
            paddingLeft: '5px' }
}

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            paddingTop: '7px' }   
}

const trainButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

export default class CreateModel extends React.Component<AppProps, AppState> {
    static contextType = AppContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            algorithm: 'classification', 
            options: [],
            headers: [],
            defaultSelectedWorkspaceOption: {},
            workspaceOptions: null,
            workspaceChoice: null,
            createNewWorkspace: false,
            resourceGroupOptions: [],
            resourceGroupChoice: null,
            newWorkspaceName: null
        };
        this.updateHeader = this.updateHeader.bind(this);
        this.createEventListener();
        this.updateHeader(0);
    };

    //@ts-ignore
    private async makeCsv(values){
        let csv = ""
        for(var i = 0; i < values.length; i++){
            for(var j = 0; j < values[i].length; j++){
                csv += values[i][j] + ", ";
            }
            csv += "\n";
        }
        console.log("CSV:");
        console.log(csv);
    }

    async onWorkspaceChoose(){

    }

    async componentDidMount(){
        if(this.context.workspaceList === null)
            await this.context.updateWorkspaceList();
        
        let workspaceOptions = this.context.workspaceList.map((workspace: AzureMachineLearningWorkspacesModels.Workspace): IDropdownOption => { return {
            key: workspace.id,
            text: workspace.friendlyName,
            data: workspace
        }});

        let filtered: AzureMachineLearningWorkspacesModels.Workspace[] = this.context.workspaceList.filter((workspace: AzureMachineLearningWorkspacesModels.Workspace) => workspace.friendlyName === "automl-excel");
        //let filtered = workspaceOptions.filter(workspaceOption => workspaceOptions.value === "automl-excel");

        let defaultSelectedWorkspaceOption: AzureMachineLearningWorkspacesModels.Workspace = undefined;
        let createNewWorkspace = false;
        if(filtered.length > 0){
            //automl-excel exists
            defaultSelectedWorkspaceOption = filtered[0];
            createNewWorkspace = false;
        }else{
            //automl-excel doesn't exist
            createNewWorkspace = true;
        }

        
        await updateState(this, {
            defaultSelectedWorkspaceOption: defaultSelectedWorkspaceOption,
            workspaceChoice: defaultSelectedWorkspaceOption,
            workspaceOptions: workspaceOptions,
            createNewWorkspace: createNewWorkspace
        });

        let resourceGroups = await this.context.getResourceGroupsBySubscription(this.context.subscriptionId);
        let resourceGroupOptions = resourceGroups.map((resourceGroup: ResourceGroup): IDropdownOption => {
            return {
                text: resourceGroup.name,
                key: resourceGroup.name,
                data: resourceGroup
            }
        });
        await updateState(this, {
            resourceGroupOptions: resourceGroupOptions
        })
    }

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


    public async getComputeName(workspaceName){
    }

    public async createCompute(
        options:
        {
            workspaceName: string,
            resourceGroupName: string,
            location?: string,
            computeName?: string,
            vmSize?: string,
            minNodeCount?: number,
            maxNodeCount?: number
        }
    ): Promise<MachineLearningComputeCreateOrUpdateResponse> {

        if(!options.computeName) options.computeName = "automl-excel";
        if(!options.vmSize) options.vmSize = "STANDARD_DS12_V2";
        if(!options.minNodeCount) options.minNodeCount = 0;
        if(!options.maxNodeCount) options.maxNodeCount = 6;
        if(!options.location) options.location = "eastus";

        let client = new AzureMachineLearningWorkspaces(new TokenCredentials(this.context.getToken()), this.context.subscriptionId)
        return client.machineLearningCompute.createOrUpdate(options.resourceGroupName, options.workspaceName,
            options.computeName,
            {
                location: options.location,
                properties: {
                    computeType: "AmlCompute",
                    properties: {
                        scaleSettings: {
                            minNodeCount: options.minNodeCount,
                            maxNodeCount: options.maxNodeCount
                        },
                        vmPriority: "Dedicated",
                        vmSize: options.vmSize
                    }
                }
            },
            {
                timeout: 600000
            }
        );

    }

    private async listComputes(resourceGroupNames: string, workspaceName: string){
        let client = new AzureMachineLearningWorkspaces(new TokenCredentials(this.context.getToken()), this.context.subscriptionId);

        let current = await client.machineLearningCompute.listByWorkspace(resourceGroupNames, workspaceName);
        let fullList = [...current];

        while(current.nextLink){
            current = await client.machineLearningCompute.listByWorkspaceNext(current.nextLink);
            fullList = [...current, ...fullList];
        }

        return fullList;
    }

    private async onCreateModel(){
        let resourceGroupName: string;
        let workspace: AzureMachineLearningWorkspacesModels.Workspace;
        if(this.state.createNewWorkspace){
            console.log("Make workspace with resource group ".concat(this.state.resourceGroupChoice).concat(" and name ").concat(this.state.newWorkspaceName))
            try{
                let result: ResourceManagementModels.DeploymentExtended = await this.context.createWorkspace(this.state.newWorkspaceName, this.state.resourceGroupChoice);
                console.log(result);
            }catch(err){
                console.error(err);
            }

            resourceGroupName = this.state.resourceGroupChoice;
            workspace = this.context.getWorkspace(resourceGroupName, this.state.newWorkspaceName);
        }else{
            workspace = this.state.workspaceChoice;
            resourceGroupName = workspace.id.split("resourceGroups/")[1].split("/")[0];
            console.log("Resource group:");
            console.log(resourceGroupName);
        }

        let computes = await this.listComputes(resourceGroupName, workspace.name);
        console.log("Computes:");
        console.log(computes);
        
    }
    
    render() {

        if(this.state.workspaceOptions === null){
            return <PageLoad text="Loading workspace list" />;
        }


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
                    placeholder="Select workspace"
                    defaultSelectedKey={this.state.defaultSelectedWorkspaceOption}
                    label="Which workspace do you want to use?"
                    options={this.state.workspaceOptions}
                    responsiveMode={ResponsiveMode.xLarge}
                    styles={dropdownStyle}
                    disabled={this.state.createNewWorkspace}
                    onChange={(event, option?) => {this.setState({ workspaceChoice: option.data })}} />
                <Stack {...columnProps} >
                    <Checkbox defaultChecked={this.state.createNewWorkspace} label="Create new workspace" onChange={(ev?, checked?) => this.setState({createNewWorkspace: checked})} />

                    {
                        this.state.createNewWorkspace ?
                        <>
                            <Dropdown
                            placeholder="Select resource group"
                            options={this.state.resourceGroupOptions}
                            onChange={(event, option?) => this.setState({ resourceGroupChoice: option.key as string })} />
                            <TextField label="New Workspace Name" placeholder="automl-excel" onChange={(e, newVal) => {this.setState({ newWorkspaceName: newVal })}} />
                            
                        </>
                        :
                        <></>
                    }
                </Stack>
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
                            imageSize: { width: 34, height: 38}
                        },
                        {
                            key: 'forecasting', 
                            text: 'Forecasting', 
                            imageSrc: '/assets/forecasting.png', 
                            selectedImageSrc: '/assets/forecastingSelected.png', 
                            imageSize: { width: 35, height: 38}
                        }
                    ]}/>
                { forecastContent }
                <Link to="/modeltraining">
                    <PrimaryButton styles={trainButtonStyle} onClick={this.onCreateModel.bind(this)} text="create" />
                </Link>
                {/* <div>
                    <br></br> <br></br> <br></br> <br></br> <br></br>
                    <Link to='/createmodel'>Create Model</Link><br></br>
                    <Link to='/modeltraining'>Model Training</Link><br></br>
                    <Link to='/applymodel'>Use Model</Link><br></br>
                    <Link to='/tutorial/importdata'>Tutorial: Prepare Data</Link><br></br>
                    <Link to='/tutorial/outputfield'>Tutorial: Create New Model</Link><br></br>
                    <Link to='/tutorial/modeltraining'>Tutorial: Model Training</Link><br></br>
                    <Link to='/tutorial/analysis'>Tutorial: Analysis</Link><br/>
                    <Link to='/Analysis'>Analysis</Link>
                </div> */}
            </div>
        );
    }
}