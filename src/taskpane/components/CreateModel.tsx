import * as React from 'react'
import '../taskpane.css'
import { ResponsiveMode, Checkbox } from 'office-ui-fabric-react'
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react'
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from 'office-ui-fabric-react'
import { PrimaryButton, IconButton, IButtonStyles } from 'office-ui-fabric-react'
import { TextField, Stack, IStackProps } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { AzureMachineLearningWorkspacesModels, AzureMachineLearningWorkspaces } from '@azure/arm-machinelearningservices';
import { AppContext, AppContextState } from './AppContext';
import { PageLoad } from './PageLoad';
import { updateState } from './util';
import { ResourceGroup } from '@azure/arm-resources/esm/models';
import { ResourceManagementModels } from '@azure/arm-resources';
import { TokenCredentials } from '@azure/ms-rest-js';
import { MachineLearningComputeCreateOrUpdateResponse } from '@azure/arm-machinelearningservices/esm/models';
import { DataStoreService } from '../../automl/services/DataStoreService';
import { StorageService } from '../../automl/services/StorageService';
import { BlockBlobService } from '../../automl/services/BlockBlobService';
import { JasmineService } from '../../automl/services/JasmineService';
import { AdvancedSetting } from '../../automl/services/AdvancedSetting';
import { RunType } from '../../automl/services/constants/RunType';
import { IRunDtoWithExperimentName } from '../../automl/services/RunHistoryService';

export interface AppProps {
}

export interface AppState {
    algorithm: string
    headers: string[],
    workspaceOptions: IDropdownOption[],
    createNewWorkspace: boolean,
    resourceGroupOptions: IDropdownOption[],
    resourceGroupChoice: string,
    newWorkspaceName: string,
    columnNames: string[],
    outputColumn: string,
    timeColumn: string,
    newModelName: string,
    trainingRuns: IRunDtoWithExperimentName[]
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
    static contextType = AppContext;
    csvString: string;

    constructor(props, context) {
        super(props, context);
        this.state = {
            algorithm: 'classification', 
            headers: [],
            workspaceOptions: null,
            createNewWorkspace: false,
            resourceGroupOptions: [],
            resourceGroupChoice: null,
            newWorkspaceName: null,
            columnNames: [],
            outputColumn: null,
            timeColumn: null,
            newModelName: null,
            trainingRuns: []
        };
        this.updateHeader = this.updateHeader.bind(this);
        this.createEventListener();
        this.updateHeader(0);
    };

    //@ts-ignore
    private async makeCsv(values){
        console.log("Making csv:");
        let csv = ""
        for(var i = 0; i < values.length; i++){
            for(var j = 0; j < values[i].length; j++){
                csv += values[i][j] + ", ";
            }
            csv += "\n";
        }
        this.csvString = csv;
        console.log("CSV!!!! :")
        console.log(csv.length);
    }

    async onWorkspaceChoose(){

    }

    async reloadTrainingRuns(){

    }

    async componentDidMount(){
        let context: AppContextState = this.context;
        if(this.context.workspaceList === null)
            await this.context.updateWorkspaceList();
        
        let workspaceOptions = this.context.workspaceList.map((workspace: AzureMachineLearningWorkspacesModels.Workspace): IDropdownOption => { return {
            key: workspace.id,
            text: workspace.friendlyName,
            data: workspace
        }});

        
        let createNewWorkspace = context.workspace === null;
        
        await updateState(this, {
            workspaceOptions,
            createNewWorkspace
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
        });
        console.log("Trained Runs:");
        try{
            console.log(await this.context.listTrainedRuns());
        }catch(err){console.log(err)};
        console.log("Training Runs:");
        try{
            console.log(await this.context.listTrainingRuns());
        }catch(err){console.log(err)};
        
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

            await context.sync()
            this.setState ({
                headers: range.values[0],
                columnNames: range.values[0]
            })
            console.log(this.state.headers)
            this.makeCsv(range.values)
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
        if(!options.vmSize) options.vmSize = "Standard_DS12_V2";
        if(!options.minNodeCount) options.minNodeCount = 0;
        if(!options.maxNodeCount) options.maxNodeCount = 6;
        if(!options.location) options.location = "eastus";

        console.log("Options:");
        console.log(options);

        let client = new AzureMachineLearningWorkspaces(new TokenCredentials(this.context.token), this.context.subscriptionId);
        try{
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
        }catch(err){console.log("Error:"); console.log(err); return null;}

    }

    private async listComputes(resourceGroupNames: string, workspaceName: string){
        let client = new AzureMachineLearningWorkspaces(new TokenCredentials(this.context.token), this.context.subscriptionId);

        let current = await client.machineLearningCompute.listByWorkspace(resourceGroupNames, workspaceName);
        let fullList = [...current];

        while(current.nextLink){
            current = await client.machineLearningCompute.listByWorkspaceNext(current.nextLink);
            fullList = [...current, ...fullList];
        }

        return fullList;
    }

    //@ts-ignore
    private async createParentRun(){
        
    }

    private async onCreateModel(){
        let context: AppContextState = this.context
        let resourceGroupName: string;
        let workspace: AzureMachineLearningWorkspacesModels.Workspace;
        
        try{
            if(this.state.createNewWorkspace){
                console.log("Make workspace with resource group ".concat(this.state.resourceGroupChoice).concat(" and name ").concat(this.state.newWorkspaceName))
                let result: ResourceManagementModels.DeploymentExtended = await this.context.createWorkspace(this.state.newWorkspaceName, this.state.resourceGroupChoice);
                console.log(result);
                resourceGroupName = this.state.resourceGroupChoice;
                workspace = this.context.getWorkspace(resourceGroupName, this.state.newWorkspaceName);
                await this.context.setWorkspace(workspace)
            }else{
                workspace = context.workspace;
                resourceGroupName = workspace.id.split("resourceGroups/")[1].split("/")[0];
                console.log("Resource group:");
                console.log(resourceGroupName);
                await this.context.setWorkspace(workspace);
            }

            let computes = await this.listComputes(resourceGroupName, workspace.name);
            console.log("Computes:");
            console.log(computes);
            
            if(computes.length === 0){
                console.log("Creating new compute");
                let response = await this.createCompute({
                    workspaceName: workspace.name,
                    resourceGroupName,
                    computeName: "automl-excel"
                });
                console.log(response);
                console.log("Computes after creation:")
                computes = await this.listComputes(resourceGroupName, workspace.name);
                console.log(computes);
            }
            let compute = computes[0];
            console.log("Chose compute:");
            console.log(compute);
            console.log("Services:");
            console.log(this.context.services);
            let dataStoreService: DataStoreService = this.context.services[DataStoreService.name];

            let dataStore = await dataStoreService.getDefault();
            console.log("Data store:");
            console.log(dataStore);
            let storageService: StorageService = this.context.services[StorageService.name];
            console.log("Storage service:");
            console.log(storageService);
            console.log("Resource Group:");
            console.log((storageService as any).props.resourceGroupName);
            let storageAccount = await storageService.getAccount((storageService as any).props.resourceGroupName, dataStore.azureStorageSection.accountName);
            console.log("Account:");
            console.log(storageAccount);
            let containers = await storageService.listContainer(storageAccount);
            let container = containers.value[0];
            console.log("Containers")
            console.log(containers)
            console.log("Container")
            console.log(container)
            let sasToken = await storageService.getSasToken(storageAccount);
            let blob = {
                name: "dataset.csv",
                deleted: false,
                snapshot: "sampleSnapShot",
                properties: {
                    lastModified: new Date(),
                    etag: "sampleEtag",
                    contentLength: 1000
                }
            };
            console.log("File:")
            let blobObj: any = new Blob([this.csvString]);
            blobObj.name = "dataset.csv";
            let file = blobObj as File;
            console.log(file)
            let blockBlobService = new BlockBlobService((storageService as any).props, {
                container,
                account: storageAccount,
                sasToken: sasToken.accountSasToken,
                blob
            });
            let skipUpload = false;
            console.log("Blob Service");
            console.log(blockBlobService);
            if(!skipUpload){
                let uploadResult = await blockBlobService.uploadBlob(file, (percent: number) => {console.log("Uploading " + percent + " percent done!")});
                console.log("Upload Result:");
                console.log(uploadResult);
            }
            console.log("Jasmine Service:")
            let jasmineService: JasmineService = this.context.services[JasmineService.name]
            console.log(jasmineService);

            console.log("Advanced Settings:");

            let advancedSettings: AdvancedSetting = {
                jobType: this.state.algorithm as RunType,
                column: this.state.outputColumn,
                experimentTimeoutMinutes: 60,
                metric: "accuracy",
                maxIteration: 100,
                experimentExitScore: null,
                maxConcurrent: 1,
                maxCores: null,
                preprocess: true,
                nCrossValidations: 5,
                blacklistAlgos: null,
                validationSize: null,
                timeSeriesColumn: this.state.algorithm === "forecasting" ? this.state.timeColumn : null,
                maxHorizon: null,
                grainColumns: null
            };

            console.log(advancedSettings);
            let features = this.state.columnNames.filter((columnName) => columnName !== this.state.outputColumn);
            console.log("Features");
            console.log(features);
            let previewData = {
                data: [],
                delimiter: ",",
                hasHeader: true,
                header: []
            }
            console.log("Run ID:");
            let runId = await jasmineService.createRun(features, previewData, this.state.newModelName, compute, dataStore.name, "dataset.csv", advancedSettings);
            console.log(runId);
            console.log("Run Status:");
            let runStatus = await jasmineService.startRun(runId, this.state.newModelName, compute);
            console.log(runStatus);
        }catch(err){console.log(err)};
    }
    
    render() {
        let context: AppContextState = this.context;

        if(this.state.workspaceOptions === null){
            return <PageLoad text="Loading workspace list" />;
        }

        let columnOptions = this.state.columnNames.map(feature => {return {key: feature, text: feature}})

        const forecastContent = this.state.algorithm === 'forecasting' 
            ?   <div>
                    <Dropdown 
                        placeholder="Select the time column" 
                        label='Which column holds the timestamps?' 
                        onChange={(event, option) => this.setState({timeColumn: option.text})}
                        options={columnOptions} 
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
                    defaultSelectedKey={context.workspace.id}
                    label="Which workspace do you want to use?"
                    options={this.state.workspaceOptions}
                    responsiveMode={ResponsiveMode.xLarge}
                    styles={dropdownStyle}
                    disabled={this.state.createNewWorkspace}
                    onChange={(event, option?) => {context.setWorkspace(option.data)}} />
                <TextField label="New Model Name" placeholder="automl-excel" onChange={(e, newVal) => {this.setState({newModelName: newVal})}} />
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
                    options={columnOptions} 
                    onChange={(event, option) => this.setState({outputColumn: option.text})}
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
                <PrimaryButton styles={trainButtonStyle} text="Create Model" onClick={this.onCreateModel.bind(this)} />
                { this.state.trainingRuns.length > 0 ? <p>Training Runs:</p> : <></> }
                {
                    this.state.trainingRuns.map((run: IRunDtoWithExperimentName) => {
                        return <p>{run.experimentName} - {run.startTimeUtc} - {run.status}</p>
                    })
                }  
            </div>
        );
    }
}