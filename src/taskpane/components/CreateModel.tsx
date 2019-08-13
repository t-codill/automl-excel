import * as React from 'react'
import '../taskpane.css'
import { ResponsiveMode } from 'office-ui-fabric-react'
import { Dropdown, IDropdownStyles } from 'office-ui-fabric-react'
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from 'office-ui-fabric-react'
import { PrimaryButton, IconButton, IButtonStyles } from 'office-ui-fabric-react'
import { TextField, Stack, IStackProps } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { AzureMachineLearningWorkspacesModels, AzureMachineLearningWorkspaces } from '@azure/arm-machinelearningservices';
import { AppContext, AppContextState } from './AppContext';
import { TokenCredentials } from '@azure/ms-rest-js';
import { MachineLearningComputeCreateOrUpdateResponse } from '@azure/arm-machinelearningservices/esm/models';
import { DataStoreService } from '../../automl/services/DataStoreService';
import { StorageService } from '../../automl/services/StorageService';
import { BlockBlobService } from '../../automl/services/BlockBlobService';
import { JasmineService } from '../../automl/services/JasmineService';
import { AdvancedSetting } from '../../automl/services/AdvancedSetting';
import { RunType } from '../../automl/services/constants/RunType';
import { IRunDtoWithExperimentName } from '../../automl/services/RunHistoryService';
import { defaultRegion } from "../../../config";

export interface AppProps {
}

export interface AppState {
    algorithm: string
    headers: string[],
    columnNames: string[],
    outputColumn: string,
    timeColumn: string,
    newModelName: string,
    trainingRuns: IRunDtoWithExperimentName[]
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
    csvString: string;

    constructor(props, context) {
        super(props, context);
        this.state = {
            algorithm: 'classification', 
            headers: [],
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
                let value = values[i][j];
                try{
                    if((typeof value === 'string' || value instanceof String) && value.includes(",")){
                        console.log("enclosing in quotes");
                        value = '"' + value + '"';
                    }
                    csv += value + ", ";
                }catch(err){console.log(err);}
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
        //@ts-ignore
        let context: AppContextState = this.context;
    }

    async componentDidMount(){

    }

    async componentWillUnmount(){

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
        if(!options.location) options.location = defaultRegion;

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
        let workspace: AzureMachineLearningWorkspacesModels.Workspace = this.context.workspace;
        let resourceGroupName: string = this.context.resourceGroupName();

        try{
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
            let dataStoreService: DataStoreService = this.context.dataStoreService

            let dataStore = await dataStoreService.getDefault();
            console.log("Data store:");
            console.log(dataStore);
            let storageService: StorageService = this.context.storageService;
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
            let jasmineService: JasmineService = this.context.jasmineService;
            console.log(jasmineService);

            console.log("Advanced Settings:");
            //@ts-ignore
            /*
            let b = {
                "name":"trained-through-portal",
                "path":"./sample_projects/trained-through-portal",
                "subscription_id":"381b38e9-9840-4719-a5a0-61d9585e1e91",
                "resource_group":"colemansresourcegroup",
                "workspace_name":"automl-excel",
                "region":"eastus",
                "iterations":100,
                "primary_metric":"accuracy",
                "data_script":null,
                "compute_target":"automl-excel",
                "task_type":"classification",
                "validation_size":null,
                "n_cross_validations":5,
                "y_min":null,"y_max":null,
                "num_classes":null,
                "preprocess":true,
                "lag_length":0,
                "max_cores_per_iteration":24,
                "max_concurrent_iterations":6,
                "iteration_timeout_minutes":60,
                "mem_in_mb":null,
                "enforce_time_on_windows":true,
                "experiment_timeout_minutes":60,
                "experiment_exit_score":null,
                "whitelist_models":null,
                "auto_blacklist":false,
                "blacklist_samples_reached":false,
                "exclude_nan_labels":true,
                "verbosity":20,
                "debug_log":"automl_errors.log",
                "show_warnings":false,
                "model_explainability":false,
                "service_url":null,
                "sdk_url":null,
                "sdk_packages":null,
                "telemetry_verbosity":"INFO",
                "send_telemetry":true,
                "spark_service":null,
                "metrics":null,
                "enable_ensembling":true,
                "ensemble_iterations":15,
                "enable_tf":false,
                "enable_cache":true,
                "enable_subsampling":false,
                "subsample_seed":null,
                "cost_mode":0,
                "metric_operation":"maximize",
                "is_timeseries":false,
                "time_column_name":null,
                "max_horizon":null,
                "enable_onnx_compatible_models":false,
                "enable_voting_ensemble":true,
                "enable_stack_ensemble":true,
                "enable_stack_ensembling":false,
                "enable_early_stopping":false,
                "early_stopping_n_iters":10,
                "enable_feature_sweeping":false
            }
            */
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
                <Stack {...columnProps}>
                    <TextField 
                        label="Model Name" 
                        placeholder="Enter model name" 
                        onChange={(e, newVal) => {this.setState({newModelName: newVal})}} />
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
                <Link to="/modeltraining"><PrimaryButton styles={trainButtonStyle} text="Create" onClick={this.onCreateModel.bind(this)} /></Link>

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