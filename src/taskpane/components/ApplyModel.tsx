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
import { getCondaFileFromTemplate } from '../../automl/common/utils/deployment/getCondaFileFromTemplate';
import { getScoringFileFromTemplate } from '../../automl/common/utils/deployment/getScoringFileFromTemplate';

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

// const windowButtonStyle: Partial<IButtonStyles> = {
//     root: { color: 'black', 
//             display: 'inline-block', 
//             height: '30px',
//             paddingTop: '7px',
//             paddingBottom: '2px',
//             backgroundColor: '#ffffff',
//             paddingLeft: '5px' }   
// }

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

// const dropdownStyle: Partial<IDropdownStyles> = {
//     root: { paddingLeft: '5px',
//             paddingRight: '5px',
//             paddingTop: '6px',
//             paddingBottom: '10px' }
// };

const buttonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

export default class ApplyModel extends React.Component<AppProps, AppState> {
    static contextType = AppContext;
    
    // private inputFieldsWindow;
    // private outputFieldWindow;

    private shouldRefresh: boolean = true;

    constructor(props, context) {
        super(props, context);
        // this.inputFieldsWindow = React.createRef();
        // this.outputFieldWindow = React.createRef();
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
            try{
                deployments = await context.modelManagementService.getDeployListByRunId(bestChildRun.runId);
                console.log(deployments);
                deployed = deployments.length > 0;
            }catch(err){
                console.error(err);
            };

            trainedRunData.push({
                parentRun,
                bestChildRun,
                deployments,
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


    private async registerModel(bestChildRun: MicrosoftMachineLearningRunHistoryContractsRunDto, experimentName: string){
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
            experimentName,
            `${bestChildRun.runId}_Model`,
            `${modelUri}`
        );
        console.log(asset);

        console.log("Model:");
        let model = await context.modelManagementService.registerModel(
            experimentName,
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

            let model = await this.registerModel(bestChildRun, parentRun.experimentName);
            
            console.log("updating parent tag")
            await context.runHistoryService.updateTag(parentRun, parentRun.experimentName, "model_id", model.id);
            console.log("updating child tag");
            await context.runHistoryService.updateTag(bestChildRun, parentRun.experimentName, "model_id", model.id);
            
            console.log("Conda File:");
            let condaFileContent = getCondaFileFromTemplate(bestChildRun);
            console.log(condaFileContent);

            const condaFilePath = "ModelDeploy/condaEnv.yml";
            const condaArtifactId = await context.artifactService.uploadArtifact(`dcid.${bestChildRun.runId}`, condaFilePath, condaFileContent);
            const condaArtifactLocation = this.getArtifactUrl(condaArtifactId);

            console.log("Scoring File:");
            let scoringFileContent = getScoringFileFromTemplate(parentRun, bestChildRun.runId);
            console.log(scoringFileContent)

            const scoringFilePath = "ModelDeploy/scoring.py";
            const scoringArtifactId = await context.artifactService.uploadArtifact(`dcid.${bestChildRun.runId}`, scoringFilePath, scoringFileContent);
            const scoringArtifactLocation = this.getArtifactUrl(scoringArtifactId);

            const scoringFileName = scoringArtifactLocation.substring(scoringArtifactLocation.lastIndexOf("/") + 1);

            console.log("Response:");
            const response = await context.modelManagementService.createDeployment(
                parentRun.experimentName,
                "",
                bestChildRun.runId,
                model.id,
                condaArtifactLocation,
                scoringFileName,
                scoringArtifactLocation
            );
            console.log(response);

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
/*
    private readonly registerModel = async () => {
        let context: AppContextState = this.context;
        
        let experimentName = "";
        let
        const asset = await this.services.modelManagementService.createAsset(
            `${this.props.experimentName}`,
            `${this.props.run.runId}_Model`,
            this.props.modelUri
        );
        this.logUserAction("RegisterModel",
            { modelId: this.state.modelId, experimentName: this.props.experimentName, runId: this.props.run.runId });
        if (!asset || !asset.id) {
            return;
        }
        const model = await this.services.modelManagementService.registerModel(
            `${this.props.experimentName}`,
            `${this.props.run.runId}_Model`,
            asset.id,
            "application/json",
            this.props.run.runId,
            this.props.experimentName
        );
        if (!model) {
            this.setState({ registering: false });
            return;
        }
        const modelId = model.name;
        const updateResult = await this.services.runHistoryService.updateTag(this.props.run, this.props.experimentName, "model_id", modelId);
        if (!updateResult) {
            this.setState({ registering: false });
            return;
        }
        this.props.onModelRegister();
        this.setState({ registering: false, modelId });
    }
*/

    public async onRunClick(runData){
        if(!runData.deployed){
            await this.deployModel(runData.parentRun);
        }else{
            console.log("Using model!")
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