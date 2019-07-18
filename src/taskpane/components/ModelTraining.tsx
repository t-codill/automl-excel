import * as React from 'react';
import { IconButton, IButtonStyles } from 'office-ui-fabric-react';
import { ProgressIndicator, IProgressIndicatorStyles } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import { Async } from '@uifabric/utilities';

export interface AppProps {
}

export interface AppState {
    nIteration: number;
    nCompletedIteration: number;
    percentComplete: number;
    modelName: string;
    outputField: string;
    modelSummary: boolean;
    trainingStatus: boolean;
}

const progressIndicatorStyle: Partial<IProgressIndicatorStyles> = {
    root: { paddingLeft: '3px',
            paddingRight: '3px',
            paddingTop: '6px',
            paddingBottom: '10px' }
}

const windowButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'grey', 
            display: 'inline-block', 
            width: '25px', 
            height: '15px',
            paddingTop: '7px' }   
}

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            width: '30px', 
            paddingTop: '7px' }   
}
  
const INTERVAL_DELAY = 100;
const INTERVAL_INCREMENT = 0.01;
const RESTART_WAIT_TIME = 2000;

export default class ModelTraining extends React.Component<AppProps, AppState> {

    private _interval: number;
    private _async: Async;
  
    constructor(props, context) {
        super(props, context);
        this._async = new Async(this);
        this.state = {
            nIteration: 50,
            nCompletedIteration: 13,
            percentComplete: 0,
            modelName: 'Sample Model Name',
            outputField: 'Sample Output',
            modelSummary: false,
            trainingStatus: true
        }
        this._startProgress = this._startProgress.bind(this)
        console.log(this.state.modelSummary)
        console.log(this.state.trainingStatus)
    }

    public componentDidMount(): void {
        this._startProgress();
    }
    
    public componentWillUnmount(): void {
        this._async.dispose();
    }
    
    private _startProgress(): void {
        this.setState({
            percentComplete: 0
        });
    
        // update progress
        this._interval = this._async.setInterval(() => {
            let percentComplete = this.state.percentComplete + INTERVAL_INCREMENT;
            // let percentComplete = this.state.nCompletedIteration / this.state.nIteration
    
            if (percentComplete >= 1.0) {
                percentComplete = 1.0;
                this._async.clearInterval(this._interval);
                this._async.setTimeout(this._startProgress, RESTART_WAIT_TIME);
            }
            this.setState({
                percentComplete: percentComplete
            });
        }, INTERVAL_DELAY);
    }

    private _iconSummaryClicked(): void {
        this.setState({
            modelSummary: !this.state.modelSummary 
        })
        console.log(this.state.modelSummary)
    }

    private _iconStatusClicked(): void {
        this.setState({
            trainingStatus: !this.state.trainingStatus 
        })
        console.log(this.state.trainingStatus)
    }

    render() {
        const modelSummaryView = this.state.modelSummary 
            ?   <div className="row">
                    <div className='column-combined'>
                        <p className='training-text-big'>{this.state.modelName}</p>
                        <p className='training-text-small'>Model Name</p>
                    </div>
                    <div className='column'>
                        <p className='training-text-big'>{this.state.outputField}</p>
                        <p className='training-text-small'>Output Field</p>
                        <p className='training-text-big'>7</p>
                        <p className='training-text-small'>Input Fields</p>
                    </div>
                    <div className='column'>
                        <p className='training-text-big'>Classification</p>
                        <p className='training-text-small'>Type of Problem</p>
                        <p className='training-text-big'>12k</p>
                        <p className='training-text-small'>Rows</p>
                    </div>
                </div>
            :   null;

        const trainingStatusView = this.state.trainingStatus
            ?   <div className="row">
                    <div className='column'>
                        <p className='training-text-big'>Running</p>
                        <p className='training-text-small'>Status</p>
                        <p className='training-text-big'>23</p>
                        <p className='training-text-small'>Iterations Completed</p>
                    </div>
                    <div className='column'>
                        <p className='training-text-big'>93.6%</p>
                        <p className='training-text-small'>Best Performance</p>
                        <p className='training-text-big'>40</p>
                        <p className='training-text-small'>Total Iterations</p>
                    </div>
                </div>
            :   null;

        return (
            <div>
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorial/typeofproblem">
                    <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/></Link>
                    <span className='header_text'> Model Training </span>
                </div>
            
                <ProgressIndicator 
                    label={'Training: ' + this.state.modelName}
                    description="Model training is in progress" 
                    percentComplete={this.state.percentComplete}
                    styles={progressIndicatorStyle} />
 
                <IconButton styles={windowButtonStyle} iconProps={{ iconName: (this.state.modelSummary ? 'ChevronUp' : 'ChevronDown')}} onClick={this._iconSummaryClicked.bind(this)}/>
                <span className='text'> Model Summary </span>
                { modelSummaryView }
                <br></br>
                <IconButton styles={windowButtonStyle} iconProps={{ iconName: (this.state.trainingStatus ? 'ChevronUp' : 'ChevronDown')}} onClick={this._iconStatusClicked.bind(this)}/>
                <span className='text'> Training Status </span>
                { trainingStatusView }
                <p className='text'> TODO: provide status bar and short summary of model </p>
                <p className='text'> TODO: provide # of iteration completed / # of total iterations and best metric score overall </p>
            </div>
        );
    }
}