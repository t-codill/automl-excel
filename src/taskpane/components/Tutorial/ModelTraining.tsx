import * as React from 'react';
import { PrimaryButton, IconButton, IButtonStyles, CommandBarButton, PanelType } from 'office-ui-fabric-react';
import { ProgressIndicator, IProgressIndicatorStyles } from 'office-ui-fabric-react';
import { MessageBar, MessageBarType, IMessageBarStyles} from 'office-ui-fabric-react';
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
    prepareRun: boolean
}

const messageBarStyle: Partial<IMessageBarStyles> = {
    innerText: { position: 'relative',
                 marginTop: '-1px' }
}

const progressIndicatorStyle: Partial<IProgressIndicatorStyles> = {
    root: { paddingLeft: '7px',
            paddingRight: '7px',
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

const nextButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}
  
const INTERVAL_DELAY = 100;
const INTERVAL_INCREMENT = 0.01;
const RESTART_DELAY = 2500;

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
            nCompletedIteration: 0,
            percentComplete: 0,
            bestMetric: 0,
            modelName: 'Titanic Passanger Survival',
            description: 'Preparing Data',
            inputFields: ["passenger class", "name", "sex", "age", "sibling/spouse", "parent/child", "ticket", "fare", "embarked", "home"],
            outputField: 'survived',
            modelSummaryView: true,
            trainingStatusView: true,
            inputFieldView: false,
            prepareRun: false,
        }
        this._triggerStartProgress = this._triggerStartProgress.bind(this)
        this._startProgress = this._startProgress.bind(this)
    }

    public componentDidMount(): void {
        this._startProgress();
    }
    
    public componentWillUnmount(): void {
        this._async.dispose();
    }

    //starts running after preparing
    private _triggerStartProgress(): void {
        this.setState({
            prepareRun: true
        })
    }

    private _startProgress(): void {
        this._interval = this._async.setInterval(() => {

            //start running if prepare has been processed for RESTART_DELAY amount of time
            if (!this.state.prepareRun) {
                this._async.setTimeout(this._triggerStartProgress, RESTART_DELAY);
            } else {            
                //percent complete is proportional to completed iterations
                //TODO: percent complete should depend on number of completed iterations
                let percentComplete = this.state.percentComplete + INTERVAL_INCREMENT;
                // let percentComplete = this.state.nCompletedIteration / this.state.nIteration

                if (this.state.nCompletedIteration < this.state.nIteration) {
                    this.setState({
                        description: 'Running',
                        nCompletedIteration: (this.state.percentComplete * this.state.nIteration) | 0,
                        percentComplete: percentComplete
                    })    
                } else if (this.state.nCompletedIteration === this.state.nIteration) {
                    this.setState({
                        description: 'Complete'
                    })
                }

                if (percentComplete <= 0.1) {
                    this.setState({
                        bestMetric: 46.5
                    })
                } else if (percentComplete <= 0.2) {
                    this.setState({
                        bestMetric: 50.5
                    })
                } else if (percentComplete <= 0.3) {
                    this.setState({
                        bestMetric: 63.7
                    }); 
                } else if (percentComplete <= 0.4) {
                    this.setState({
                        bestMetric: 68.9
                    });  
                } else if (percentComplete <= 0.6) {
                    this.setState({
                        bestMetric: 74.1
                    });  
                } else if (percentComplete <= 0.7) {
                    this.setState({
                        bestMetric: 82.9
                    }); 
                } else if (percentComplete <= 0.8) {
                    this.setState({
                        bestMetric: 83.6
                    }); 
                } else if (percentComplete <= 0.9) {
                    this.setState({
                        bestMetric: 86.8
                    }); 
                }
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

    //control input penel view
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
                    <Link style={{position: 'absolute', left: 0}} to="/tutorial/typeofproblem">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Tutorial: Create New Model </span>
                </div>
                <MessageBar 
                    messageBarType={MessageBarType.warning}
                    styles={messageBarStyle}> The process was <b>sped up</b> for tutorial purposes </MessageBar>
                <p className='training-text-with-margin'> While creating the model, you can see the <b>model summary</b> and <b>run status</b>. Once the model is created, click next for the performance summary. </p>
                <div>
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
                                <p className='text-big-underline' 
                                onClick={this._inputFieldClicked.bind(this)}>{this.state.inputFields.length}</p>
                                <p className='text-small' 
                                onClick={this._inputFieldClicked.bind(this)}>Input Fields</p>
                                <Panel
                                    isOpen={this.state.inputFieldView}    
                                    type={PanelType.customNear}
                                    customWidth='150px'
                                    onDismiss={this._onCalloutDismiss}
                                    headerText="Input Fields">
                                    <span>{this.state.inputFields.join('\n')}</span>
                                </Panel>
                            </div>
                            <div className='column'>
                                <p className='text-big'>Classification</p>
                                <p className='text-small'>Type of Problem</p>
                                <p className='text-big'>182</p>
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
                </div>
                <Link to="/tutorial/applymodel">
                    <PrimaryButton 
                        styles={nextButtonStyle} 
                        text="Apply Model"
                        disabled={this.state.nCompletedIteration === this.state.nIteration ? false : true} />
                </Link>
            </div>
        );
    }
}