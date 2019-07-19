import * as React from 'react';
import { IconButton, IButtonStyles, CommandBarButton } from 'office-ui-fabric-react';
import { ProgressIndicator, IProgressIndicatorStyles } from 'office-ui-fabric-react';
import { Callout, DirectionalHint } from 'office-ui-fabric-react'
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
    inputFieldView: boolean;
}

const progressIndicatorStyle: Partial<IProgressIndicatorStyles> = {
    root: { paddingLeft: '5px',
            paddingRight: '5px',
            paddingTop: '6px',
            paddingBottom: '10px' }
}

const windowButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'black', 
            display: 'inline-block', 
            height: '30px',
            paddingTop: '7px',
            paddingBottom: '2px',
            backgroundColor: '#ffffff' }   
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
    private modelSummaryWindow;
    private trainingStatusWindow;
    private inputFields;
  
    constructor(props, context) {
        super(props, context);
        this._async = new Async(this);
        this.modelSummaryWindow = React.createRef();
        this.trainingStatusWindow = React.createRef();
        this.inputFields = React.createRef();
        this.state = {
            nIteration: 50,
            nCompletedIteration: 13,
            percentComplete: 0,
            modelName: 'Sample Model Name',
            outputField: 'Sample Output',
            modelSummary: true,
            trainingStatus: true,
            inputFieldView: false
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
        const content = this.modelSummaryWindow.current;
        if (this.state.modelSummary) {
            content.style.height = '135px'
            setTimeout(() => content.style.height = 'auto', 301)
        } else {
            content.style.height = '135px'
            setTimeout(() => content.style.height = '0', 10)
        }
    }

    private _iconStatusClicked(): void {
        this.setState({
            trainingStatus: !this.state.trainingStatus 
        })
        const content = this.trainingStatusWindow.current;
        if (this.state.trainingStatus) {
            content.style.height = '95px'
            setTimeout(() => content.style.height = 'auto', 301)
        } else {
            content.style.height = '95px'
            setTimeout(() => content.style.height = '0', 10)
        }
    }

    private _inputFieldClicked(): void {
        this.setState({
            inputFieldView: !this.state.inputFieldView
        })
        console.log('A')
        console.log(this.state.inputFieldView)
    }
    private _onCalloutDismiss = (): void => {
        this.setState({
            inputFieldView: false
        })
        console.log('B')
        console.log(this.state.inputFieldView)
    }

    render() {
        return (
            <div>
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/createmodel">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Model Training </span>
                </div>
            
                <ProgressIndicator 
                    label={'Training: ' + this.state.modelName}
                    description="Model training is in progress" 
                    percentComplete={this.state.percentComplete}
                    styles={progressIndicatorStyle} />
 
                <div className='training-window'>
                    <CommandBarButton 
                        styles={windowButtonStyle} 
                        iconProps={{ iconName: (this.state.modelSummary ? 'ChevronUp' : 'ChevronDown')}} 
                        onClick={this._iconSummaryClicked.bind(this)}
                        text="Model Summary"/>
                    <div className="row" ref={this.modelSummaryWindow}>
                        <div className='column-combined'>
                            <p className='training-text-big'>{this.state.modelName}</p>
                            <p className='training-text-small'>Model Name</p>
                        </div>
                        <div className='column'>
                            <p className='training-text-big'>{this.state.outputField}</p>
                            <p className='training-text-small'>Output Field</p>
                            <p className='training-text-big' onClick={this._inputFieldClicked.bind(this)}>7</p>
                            <p className='training-text-small-last' 
                               ref={this.inputFields}
                               onClick={this._inputFieldClicked.bind(this)}>Input Fields</p>
                            <Callout
                                target={this.inputFields.current}    
                                onDismiss={this._onCalloutDismiss}
                                hidden={!this.state.inputFieldView}
                                directionalHint={DirectionalHint.rightCenter}>
                                <p className='callout-text'> input1, input2, input3 </p>
                            </Callout>
                        </div>
                        <div className='column'>
                            <p className='training-text-big'>Classification</p>
                            <p className='training-text-small'>Type of Problem</p>
                            <p className='training-text-big'>12k</p>
                            <p className='training-text-small-last'>Rows</p>
                       </div>
                    </div>
                </div>
                <div className='training-window'>
                    <CommandBarButton 
                        styles={windowButtonStyle} 
                        iconProps={{ iconName: (this.state.trainingStatus ? 'ChevronUp' : 'ChevronDown')}} 
                        onClick={this._iconStatusClicked.bind(this)}
                        text="Training Status"/>
                    <div className="row" ref={this.trainingStatusWindow}>
                        <div className='column'>
                            <p className='training-text-big'>Running</p>
                            <p className='training-text-small'>Status</p>
                            <p className='training-text-big'>23</p>
                            <p className='training-text-small-last'>Iterations Completed</p>
                        </div>
                        <div className='column'>
                            <p className='training-text-big'>93.6%</p>
                            <p className='training-text-small'>Best Performance</p>
                            <p className='training-text-big'>40</p>
                            <p className='training-text-small-last'>Total Iterations</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}