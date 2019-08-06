import * as React from 'react';
import { PrimaryButton, IconButton, IButtonStyles, CommandBarButton, PanelType } from 'office-ui-fabric-react';
import { ProgressIndicator, IProgressIndicatorStyles } from 'office-ui-fabric-react';
import { Panel } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom';
import { Async } from '@uifabric/utilities';

export interface AppProps {
}

export interface AppState {
    nIteration: number;
    nCompletedIteration: number;
    percentComplete: number;
    bestMetric: number;
    modelName: string;
    description: string;
    inputFields: string[];
    outputField: string;
    modelSummaryView: boolean;
    trainingStatusView: boolean;
    inputFieldView: boolean;
}

const progressIndicatorStyle: Partial<IProgressIndicatorStyles> = {
    root: { paddingLeft: '5px',
            paddingRight: '5px',
            paddingTop: '6px',
            paddingBottom: '10px' },
    itemName: { fontSize: '16px',
                fontWeight: '600',
                paddingBottom: '3px' },
    itemDescription: { fontSize: '14px' }
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

const buttonStyle: Partial<IButtonStyles> = {
    root: { display: 'inline-block',
            marginTop: '13px',
            marginBottom: '8px',
            marginRight: '10px',
            paddingLeft: '10px',
            paddingRight: '10px' }
}
  
const INTERVAL_DELAY = 100;
const INTERVAL_INCREMENT = 0.005;

export default class ModelTraining extends React.Component<AppProps, AppState> {

    private _async: Async;
    private modelSummaryWindow;
    private trainingStatusWindow;
    _interval: number;
  
    constructor(props, context) {
        super(props, context);
        this._async = new Async(this);
        this.modelSummaryWindow = React.createRef();
        this.trainingStatusWindow = React.createRef();
        this.state = {
            nIteration: 50,
            nCompletedIteration: 50,
            percentComplete: 0,
            bestMetric: 0,
            modelName: 'Sample Model Name',
            description: 'Complete',
            inputFields: ['input1', 'input2', 'input3'],
            outputField: 'Sample Output',
            modelSummaryView: true,
            trainingStatusView: true,
            inputFieldView: false
        }
        this._startProgress = this._startProgress.bind(this)
    }

    public componentDidMount(): void {
        this._startProgress();
    }
    
    public componentWillUnmount(): void {
        this._async.dispose();
    }


    private _startProgress(): void {
        this._interval = this._async.setInterval(() => {
            let percentComplete = this.state.percentComplete + INTERVAL_INCREMENT;
            // let percentComplete = this.state.nCompletedIteration / this.state.nIteration

            if (percentComplete <= 1.1) {
                this.setState({
                    percentComplete: percentComplete
                })
            }
        }, INTERVAL_DELAY);
    }

    private _modelSummaryClicked(): void {
        this.setState({
            modelSummaryView: !this.state.modelSummaryView 
        })
        const content = this.modelSummaryWindow.current;
        if (!this.state.modelSummaryView) {
            content.style.height = '95px'
            setTimeout(() => content.style.height = 'auto', 301)
        } else {
            content.style.height = '95px'
            setTimeout(() => content.style.height = '0', 10)
        }
    }

    private _trainingStatusClicked(): void {
        this.setState({
            trainingStatusView: !this.state.trainingStatusView 
        })
        const content = this.trainingStatusWindow.current;
        if (!this.state.trainingStatusView) {
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
    }
    private _onCalloutDismiss = (): void => {
        this.setState({
            inputFieldView: false
        })
    }

    render() {
        return (
            <div>
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/createmodel">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Create New Model </span>
                </div>
            
                <ProgressIndicator 
                    label={this.state.modelName}
                    description={this.state.description}
                    percentComplete={this.state.percentComplete}
                    styles={progressIndicatorStyle} />
                <div className='window'>
                    <CommandBarButton 
                        styles={windowButtonStyle} 
                        iconProps={{ iconName: (this.state.modelSummaryView ? 'ChevronDown' : 'ChevronUp')}} 
                        onClick={this._modelSummaryClicked.bind(this)}
                        text="Model Summary"/>
                    <div className="row" ref={this.modelSummaryWindow}>
                        <div className='column'>
                            <p className='text-big'>{this.state.outputField}</p>
                            <p className='text-small'>Output Field</p>
                            <p className='text-big' onClick={this._inputFieldClicked.bind(this)}>{this.state.inputFields.length}</p>
                            <p className='text-small' onClick={this._inputFieldClicked.bind(this)}>Input Fields</p>
                            <Panel
                                isOpen={this.state.inputFieldView}    
                                type={PanelType.customNear}
                                customWidth='150px'
                                onDismiss={this._onCalloutDismiss}
                                headerText="Input Fields">
                                <span>input1<br></br>input2<br></br>input3</span>
                            </Panel>
                        </div>
                        <div className='column'>
                            <p className='text-big'>Classification</p>
                            <p className='text-small'>Type of Problem</p>
                            <p className='text-big'>12k</p>
                            <p className='text-small'>Rows</p>
                       </div>
                    </div>
                </div>
                <div className='window'>
                    <CommandBarButton 
                        styles={windowButtonStyle} 
                        iconProps={{ iconName: (this.state.trainingStatusView ? 'ChevronDown' : 'ChevronUp')}} 
                        onClick={this._trainingStatusClicked.bind(this)}
                        text="Run Status"/>
                    <div className="row" ref={this.trainingStatusWindow}>
                        <div className='column'>
                            <p className='text-big'>{this.state.description}</p>
                            <p className='text-small'>Status</p>
                            <p className='text-big'>{this.state.nCompletedIteration}</p>
                            <p className='text-small'>Iterations Completed</p>
                        </div>
                        <div className='column'>
                            <p className='text-big'>{this.state.bestMetric + '%'}</p>
                            <p className='text-small'>Best Performance</p>
                            <p className='text-big'>{this.state.nIteration}</p>
                            <p className='text-small'>Total Iterations</p>
                        </div>
                    </div>
                </div>
                <div className='center'>
                    {/* <Link to="/analysis">
                        <PrimaryButton 
                            styles={buttonStyle} 
                            text="Peformance Summary" 
                            disabled={this.state.nCompletedIteration === this.state.nIteration ? false : true} />
                    </Link> */}
                    <Link to="/applymodel">
                        <PrimaryButton 
                            styles={buttonStyle} 
                            text="Apply Model" 
                            disabled={this.state.nCompletedIteration === this.state.nIteration ? false : true} />
                    </Link>
                </div>
            </div>
        );
    }
}