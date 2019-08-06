import * as React from 'react';
import TopContributors from './TopContributors';
import { contributeData } from './contributeData.js';
import { Link } from 'react-router-dom';
import { IconButton, PrimaryButton, IButtonStyles } from 'office-ui-fabric-react';
 
interface ModelAnalysisProps {
}
interface ModelAnalysisState {
    outputField: string
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

export default class ModelAnalysis extends React.Component<ModelAnalysisProps, ModelAnalysisState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            outputField: 'sample output'
        };
    };

    render() {
        return (
            <div>
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/modeltraining">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Performance Summary </span>
                </div>

                <div>
                    <p className='title-text'> Model Summary</p> 
                    <div className='row'>   
                        <div className='column-combined'>
                            <p className='text-big'>Sample Model Name</p>
                            <p className='text-small'>Model Name</p>
                        </div>
                        <div className='column'>
                            <p className='text-big'>Output</p>
                            <p className='text-small'>Output Field</p>
                            <p className='text-big'>5503</p>
                            <p className='text-small'>Input Rows</p>
                            <p className='text-big'>3038</p>
                            <p className='text-small'>Training Rows</p>
                        </div>
                        <div className='column'>
                            <p className='text-big'>Classification</p>
                            <p className='text-small'>Type of Problem</p>
                            <p className='text-big'>92%</p>
                            <p className='text-small'>Best Performance</p>
                            <p className='text-big'>31</p>
                            <p className='text-small'>Iterations</p>
                        </div>
                    </div>
                </div>

                <div>
                    <p className='title-text'>Top Contributors</p> 
                    <TopContributors data = {contributeData} />
                </div>            
                
                <div>
                    <p className='title-text'>Model Performance</p>
                    <div className='row'>   
                        <div className='column-unbalanced-left'>
                            <p className='text-big'>68%</p>
                            <p className='text-small'>Precision</p>
                        </div>
                        <div className='column-unbalanced-right'>
                            <p className='text-small'>of records predicted as {this.state.outputField} are likely to actually be {this.state.outputField}</p>
                        </div>
                    </div> 
                    <div className='row'>   
                        <div className='column-unbalanced-left'>
                            <p className='text-big'>70%</p>
                            <p className='text-small'>Recall</p>
                        </div>
                        <div className='column-unbalanced-right'>
                            <p className='text-small'>of records that are actually {this.state.outputField} are likely to be predicted as {this.state.outputField}</p>
                        </div>
                    </div> 
                </div>
            
                <div>
                    <Link to="/applymodel">
                        <PrimaryButton styles={homeButtonStyle} text="Apply Model" />
                    </Link>
                </div>
            </div>
        );
    }

}

