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
}

const progressIndicatorStyle: Partial<IProgressIndicatorStyles> = {
    root: { paddingLeft: '3px',
            paddingRight: '3px',
            paddingTop: '6px' }
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
            modelName: 'Sample Model Name'
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
        // reset the demo
        this.setState({
            percentComplete: 0
        });
    
        // update progress
        this._interval = this._async.setInterval(() => {
            let percentComplete = this.state.percentComplete + INTERVAL_INCREMENT;
            // let percentComplete = this.state.nCompletedIteration / this.state.nIteration
    
            // once complete, set the demo to start again
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

    render() {
        return (
            <div>
                <div style={{position: 'relative', height: 35, textAlign: 'center'}} className="header_block">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorial/typeofproblem">
                    <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}} ariaLabel="back"/></Link>
                    <span className='header_text'> Model Training </span>
                </div>
                <ProgressIndicator 
                    label={'Model Training: ' + this.state.modelName}
                    description="The model is currently being trained" 
                    percentComplete={this.state.percentComplete}
                    styles={progressIndicatorStyle} />
                <p className='ms-tutorial__text'> TODO: provide status bar and short summary of model </p>
                <p className='ms-tutorial__text'> TODO: provide # of iteration completed / # of total iterations and best metric score overall </p>
            </div>
        );
    }
}