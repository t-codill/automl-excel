import * as React from 'react';
import { PrimaryButton, DefaultButton, IconButton, IButtonStyles, CommandBarButton, PanelType } from 'office-ui-fabric-react';
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
    modelName: string;
    outputField: string;
    modelSummaryView: boolean;
    trainingStatusView: boolean;
    inputFieldView: boolean;
}

const progressIndicatorStyle: Partial<IProgressIndicatorStyles> = {
    root: { paddingLeft: '7px',
            paddingRight: '7px',
            paddingTop: '6px',
            paddingBottom: '10px' },
    itemName: { fontSize: '16px',
                fontWeight: '600' },
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

const homeButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

const buttonStyle: Partial<IButtonStyles> = {
    root: { display: 'inline-block',
            marginTop: '10px',
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
            nCompletedIteration: 13,
            percentComplete: 0,
            modelName: 'Sample Model Name',
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
        this.setState({
            percentComplete: 0
        });

        this._interval = this._async.setInterval(() => {
            let percentComplete = this.state.percentComplete + INTERVAL_INCREMENT;
            // let percentComplete = this.state.nCompletedIteration / this.state.nIteration
    
            if (percentComplete <= 1.1) {
                this.setState({
                    percentComplete: percentComplete
                });    
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
        const trainingComplete = this.state.percentComplete >= 1
            ?   <div>
                    <p className='training-text'> The model was successfully created. You may now view the performance summary and apply the model to generate predictions. </p>
                    <div className='center'>
                        <Link to="/analysis">
                                <PrimaryButton styles={buttonStyle} text="Training Report" />
                        </Link>
                        <Link to="/applymodel">
                                <PrimaryButton styles={buttonStyle} text="Apply Model" />
                        </Link>

                    </div>
                </div>
            :   null;

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
                    description="Running" 
                    percentComplete={this.state.percentComplete}
                    styles={progressIndicatorStyle} />
                { trainingComplete }
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
                            <p className='text-big' onClick={this._inputFieldClicked.bind(this)}>7</p>
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
                        text="Training Status"/>
                    <div className="row" ref={this.trainingStatusWindow}>
                        <div className='column'>
                            <p className='text-big'>Running</p>
                            <p className='text-small'>Status</p>
                            <p className='text-big'>23</p>
                            <p className='text-small'>Iterations Completed</p>
                        </div>
                        <div className='column'>
                            <p className='text-big'>93.6%</p>
                            <p className='text-small'>Best Performance</p>
                            <p className='text-big'>40</p>
                            <p className='text-small'>Total Iterations</p>
                        </div>
                    </div>
                </div>
                <div>
                    <Link to="/">
                            <DefaultButton styles={homeButtonStyle} text="Return to Home" />
                    </Link>
                </div>
            </div>
        );
    }
}