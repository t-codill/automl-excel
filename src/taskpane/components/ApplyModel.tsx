import * as React from 'react';
// import { Dropdown, IDropdownStyles, IDropdownOption, ResponsiveMode } from 'office-ui-fabric-react';
import { PrimaryButton, IconButton, IIconStyles, IButtonStyles, DefaultButton } from 'office-ui-fabric-react';
// import { CommandBarButton } from 'office-ui-fabric-react'
import { Stack, TextField, IStackProps } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import { AppContextState, AppContext } from './AppContext';
import { updateState } from './util';
import { IRunDtoWithExperimentName } from '../../automl/services/RunHistoryService';
import { MicrosoftMachineLearningRunHistoryContractsRunDto } from '@vienna/runhistory/esm/models';
//import { getCondaFileFromTemplate } from '../../automl/common/utils/deployment/getCondaFileFromTemplate';
//import { getScoringFileFromTemplate } from '../../automl/common/utils/deployment/getScoringFileFromTemplate';
import { ArtifactDto } from '@vienna/artifact/esm/models';
import { AsyncOperationStatus } from '@vienna/model-management/esm/models';
import { IArtifact } from '../../automl/services/__mocks__/ArtifactService';
import { getSwagger } from '../util';
//import { tunnelRequest } from '../util';


interface AppProps {
}

interface AppState {
    inputFields: string[];
    outputField: string;
    inputFieldsView: boolean;
    outputFieldView: boolean;
    selectedRange: string;
    trainedRunData: any[];
} 

const s: Partial<IButtonStyles> = {
    root: { marginTop: '-5px'}
}


const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            paddingTop: '7px' }   
}

const rangeButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'inline-block',
            float: 'right',
            marginRight: '5px',
            marginTop: '-32px',
            backgroundColor: '#eeeeee' }   
}

const tableIconStyle: Partial<IIconStyles> = {
    root: { color: '#0078d4',
            fontSize: '20px' }   
}

const columnProps: Partial<IStackProps> = {
    styles: { root: { marginLeft: '5px',
                      marginRight: '43px',
                      marginTop: '6px'}
            }
}

const buttonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

export default class ApplyModel extends React.Component<AppProps, AppState> {
    static contextType = AppContext;

    private shouldRefresh: boolean = true;

    constructor(props, context) {
        super(props, context);

        this.state = {
            inputFields: [],
            outputField: '',
            inputFieldsView: false,
            outputFieldView: false,
            selectedRange: 'Select the range and click on the table button on the right',
            trainedRunData: []
        }

    }

    componentWillUnmount(){
        this.shouldRefresh = false;
    }

    async componentDidMount(){
        try{
            await this.reloadTrainedRuns();
        }catch(err){console.log(err)}
    }

    private async getBestChildRun(parentRun: IRunDtoWithExperimentName): Promise<MicrosoftMachineLearningRunHistoryContractsRunDto>{
        let context: AppContextState = this.context;
        let children = await context.runHistoryService.getChildRuns(parentRun.runId, parentRun.experimentName);
        let best: MicrosoftMachineLearningRunHistoryContractsRunDto = null;
        for(var i = 0; i < children.length; i++){
            let child = children[i];
            if(child.status !== "Completed" || !(child.properties.score)) continue;
            if(best === null || parseFloat(child.properties.score) > parseFloat(best.properties.score)){
                best = child;
            }
        }
        return best;
    }

    private async reloadTrainedRuns(){

        if(!this.shouldRefresh) return;

        let context: AppContextState = this.context;
        console.log("Trained runs:")
        let trainedRuns = await context.listTrainedRuns();
        let trainedRunData = [];
        //console.log(trainedRuns);

        for(var i = 0; i < trainedRuns.length; i++){
            let parentRun = trainedRuns[i];
            let bestChildRun = await this.getBestChildRun(parentRun);
            console.log("Existing deployments:")
            let deployments = [];
            let deployed = false;
            let deployment = null;
            try{
                deployments = await context.modelManagementService.getDeployListByRunId(bestChildRun.runId);
                console.log(deployments);
                if(deployments.length > 0){
                    deployed = true;
                    deployment = deployments[0];
                    //console.log()
                    /*
                    console.log("Status:")
                    let status: AsyncOperationStatus = await context.modelManagementService.getDeployStatus(deployment.operationId)
                    console.log(status);
                    console.log("Logs:");
                    let logs = await context.modelManagementService.getDeployLogs(deployment.id);
                    console.log(logs);
                    */
                }else{

                }
                
            }catch(err){
                console.error(err);
            };

            trainedRunData.push({
                parentRun,
                bestChildRun,
                deployments,
                deployment,
                deployed
            });
        }
        await updateState(this, {
            trainedRunData
        });

        if(this.shouldRefresh){
            setTimeout(this.reloadTrainedRuns.bind(this), 10000);
        }
    }


    private async registerModel(bestChildRun: MicrosoftMachineLearningRunHistoryContractsRunDto, experimentName: string, modelName: string){
        let context: AppContextState = this.context;
        console.log("Model URI:");
        console.log({
            parentRunId: bestChildRun.parentRunId,
            runId: bestChildRun.runId,
            status: bestChildRun.status
        });
        let modelUri = await context.artifactService.getModelUri({
            parentRunId: bestChildRun.parentRunId,
            runId: bestChildRun.runId,
            status: bestChildRun.status
        });
        console.log(modelUri);

        console.log("Asset:");
        let asset = await context.modelManagementService.createAsset(
            modelName,
            `${bestChildRun.runId}_Model`,
            `${modelUri}`
        );
        console.log(asset);

        console.log("Model:");
        let model = await context.modelManagementService.registerModel(
            modelName,
            `${bestChildRun.runId}_Model`,
            asset.id,
            "application/json",
            bestChildRun.runId,
            experimentName
        );
        console.log(model);
        return model;
    }

    private readonly getArtifactUrl = (artifactId: string): string => {
        return `aml://artifact/${artifactId}`;
    }

    public async deployModel(parentRun: IRunDtoWithExperimentName){
        try{
            let context: AppContextState = this.context;
            console.log("Parent run:");
            console.log(parentRun);

            console.log("Best child:");
            let bestChildRun = await this.getBestChildRun(parentRun);
            console.log(bestChildRun);

            
            console.log("Getting artifacts:")
            let artifactsResponse = await context.artifactService.getAllArtifactsForRuns([bestChildRun.runId]);
            console.log(artifactsResponse)

            let artifacts = artifactsResponse[0];
            console.log(artifacts);

            let scoringFileArtifact = artifacts.filter((artifact: ArtifactDto) => artifact.path.includes("scoring_file"))[0];
            console.log("Scoring code:")
            let scoringCode = await context.artifactService.getContent(scoringFileArtifact as IArtifact);
            let modelName = scoringCode.split("model_name = '")[1].split("')")[0];
            let condaFileArtifact = artifacts.filter((artifact: ArtifactDto) => artifact.path.includes("conda_env"))[0];
            console.log(scoringFileArtifact);
            console.log(condaFileArtifact);

            let scoringArtifactLocation = this.getArtifactUrl(scoringFileArtifact.artifactId);
            let condaArtifactLocation = this.getArtifactUrl(condaFileArtifact.artifactId);
            console.log(scoringArtifactLocation);
            console.log(condaArtifactLocation);

            const scoringFileName = scoringArtifactLocation.substring(scoringArtifactLocation.lastIndexOf("/") + 1);

            
            let model = await this.registerModel(bestChildRun, parentRun.experimentName, modelName);
            
            console.log("updating parent tag")
            await context.runHistoryService.updateTag(parentRun, parentRun.experimentName, "model_id", model.id);
            console.log("updating child tag");
            await context.runHistoryService.updateTag(bestChildRun, parentRun.experimentName, "model_id", model.id);

            let name = parentRun.experimentName;
            if(name.length > 16){
                name = name.substring(0, 15);
            }

            console.log("Request:");
            console.log([name,
                "",
                bestChildRun.runId,
                model.id,
                condaArtifactLocation,
                scoringFileName,
                scoringArtifactLocation])
            console.log("Response:");
            let createDeploymentResponse = await context.modelManagementService.createDeployment(
                name,
                "",
                bestChildRun.runId,
                model.id,
                condaArtifactLocation,
                scoringFileName,
                scoringArtifactLocation
            );
            console.log(createDeploymentResponse)

            let deployStatus: AsyncOperationStatus;
            do{
                console.log("Deploy status:")
                deployStatus = await context.modelManagementService.getDeployStatus(createDeploymentResponse.operationId)
                console.log(status);
            }while(deployStatus.state == "NotStarted" || deployStatus.state == "Running");

        }catch(err){
            console.log("Error when deploying model:");
            console.error(err);
        }
    }

    //@ts-ignore
    private _onDropdownChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        if (item.key === 'Titanic Passanger Survival' ) {
            this.setState ({
                inputFields: ['Sex', 'Age', 'Sibling/Spouse', 'Parent/Child', 'Fare Price', 'Port Embarkation'],
                outputField: 'Survived'
            })
        } else if (item.key === 'Apple') {
            this.setState ({
                inputFields: ['Color', 'Area', 'Sugar', 'Type'],
                outputField: 'Price'
            })
        }  else if (item.key === 'Car') {
            this.setState ({
                inputFields: ['Company', 'Model', 'Year', 'Type', 'Engine', 'Wheel'],
                outputField: 'Price'
            })
        }
    }

    private _onClick = async() => {
        await Excel.run(async context => {
            var range = context.workbook.getSelectedRange();
            range.load('address')

            await context.sync();
            this.setState({
                selectedRange: range.address
            })
        })
    }

    public async onRunClick(runData){
        let context: AppContextState = this.context;

        if(!runData.deployed){
            await this.deployModel(runData.parentRun);
        }

        console.log("Getting swagger:")
        try{
            let swaggerObj = await getSwagger(runData.deployment);
            console.log(swaggerObj);

            let data = {
                "Inputs": {
                    "input1": swaggerObj.definitions.ServiceInput.example.data
                },
                "GlobalParameters": {}
            }
            console.log("Data: ")
            console.log(data);

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer" + context.token,
                },
                body: JSON.stringify(data)
            }

            console.log("Scoring Response")
            let response = await fetch(runData.deployment.scoringUri, options);
            console.log(response);
        }catch(err){
            console.error(err);
        }
        
    }

    render() {
        // const options = [
        //   { key: 'Titanic Passanger Survival', text: 'Titanic Passanger Survival' },
        //   { key: 'Apple', text: 'Apple' },
        //   { key: 'Car', text: 'Car' }
        // ];

        return (
            <div>          
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/" >
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/></Link>
                    <span className='header_text'> Apply Existing Model </span>
                </div>
                {/* <Dropdown
                    label="Which model would you like to use?"
                    placeholder="Select model to use"
                    options={options}
                    styles={dropdownStyle}
                    responsiveMode={ResponsiveMode.xLarge}
                    onChange={this._onDropdownChange.bind(this)} />     */}
                <p className='text'>List of Models</p>
                {
                    this.state.trainedRunData.map((data: any) => {
                        let run = data.parentRun;
                        return <p key={run.runId} >
                            {run.experimentName} - {run.status} - 
                            <DefaultButton styles={s} onClick={() => this.onRunClick(data)}>
                                { data.deployed ? "Run" : "Deploy and Run" }
                            </DefaultButton>
                        </p>
                    })
                }
                {/* <div className='window'>
                    <CommandBarButton 
                        styles={windowButtonStyle} 
                        iconProps={{ iconName: (this.state.inputFieldsView ? 'ChevronDown' : 'ChevronUp')}} 
                        onClick={this._inputFieldsClicked.bind(this)}
                        text="Input Fields"/>
                    <div className='row-hide' ref={this.inputFieldsWindow}>
                        <div className='fields'>
                            {this.state.inputFields.join('\n')}
                        </div>
                    </div>
                </div>
                <div className='window'>
                    <CommandBarButton 
                        styles={windowButtonStyle} 
                        iconProps={{ iconName: (this.state.outputFieldView ? 'ChevronDown' : 'ChevronUp')}} 
                        onClick={this._outputFieldClicked.bind(this)}
                        text="Output Field"/>
                    <div className='row-hide' ref={this.outputFieldWindow}>
                        <div className='fields'>
                            {this.state.outputField}
                        </div>
                    </div>  
                </div> */}
                <Stack {...columnProps}>
                    <TextField 
                        label="Select the range to generate predictions" 
                        readOnly
                        value={this.state.selectedRange}/>
                </Stack>
                <IconButton 
                    styles={rangeButtonStyle}
                    iconProps={{ iconName: 'Table', styles: {...tableIconStyle}}}
                    onClick={this._onClick.bind(this)}/>
                <PrimaryButton styles={buttonStyle} text="Generate Predictions" />
                
            </div>
        );
    }
}