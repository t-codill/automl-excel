import * as React from 'react';
import TopContributors from './TopContributors';
import { contributeData } from './contributeData.js';
import { Link } from 'react-router-dom';
import { IconButton, PrimaryButton, IButtonStyles } from 'office-ui-fabric-react';
 
interface ModelAnalysisProps {
}
interface ModelAnalysisState {
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

export default class ModelAnalysis extends React.Component<ModelAnalysisProps, ModelAnalysisState> {

    render() {
        return (
            <div>
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorial/modeltraining">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Tutorial: Create New Model </span>
                </div>
                <p className='training-text-with-margin'> This page shows a <b>performance summary</b> of your model, including <b>top predictors</b> (for the output field) and <b>evaluation metrics</b>. </p>
                <div>
                    <p className='title-text'> Model Summary</p> 
                    <div className='row'>   
                        <div className='column-combined'>
                            <p className='text-big'>Titanic Passenger Survival</p>
                            <p className='text-small'>Model Name</p>
                        </div>
                        <div className='column'>
                            <p className='text-big'>survived</p>
                            <p className='text-small'>Output Field</p>
                            <p className='text-big'>182</p>
                            <p className='text-small'>Input Rows</p>
                            <p className='text-big'>162</p>
                            <p className='text-small'>Training Rows</p>
                        </div>
                        <div className='column'>
                            <p className='text-big'>Classification</p>
                            <p className='text-small'>Type of Problem</p>
                            <p className='text-big'>86.8%</p>
                            <p className='text-small'>Best Performance</p>
                            <p className='text-big'>50</p>
                            <p className='text-small'>Iterations</p>
                        </div>
                    </div>
                </div>

                <div>
                    <p className='title-text'>Top 5 Predictors </p> 
                    <TopContributors data = {contributeData} />
                </div>            
                
                <div>
                    <p className='title-text'>Evalutation Metrics</p>
                    <div className='row'>   
                        <div className='column-unbalanced-left'>
                            <p className='text-big'>86.5%</p>
                            <p className='text-small'>Precision</p>
                        </div>
                        <div className='column-unbalanced-right'>
                            <p className='text-small-with-margin'>of records predicted as survived are likely to actually be survived</p>
                        </div>
                    </div> 
                    <div className='row'>   
                        <div className='column-unbalanced-left'>
                            <p className='text-big-with-margin'>90.5%</p>
                            <p className='text-small'>Recall</p>
                        </div>
                        <div className='column-unbalanced-right'>
                            <p className='text-small-with-margin'>of records that are actually survived} are likely to be predicted as survived</p>
                        </div>
                    </div> 
                </div>
                <Link to="/tutorial/applymodel">
                <PrimaryButton 
                        styles={nextButtonStyle} 
                        text="Apply Model" />
                </Link>
            </div>
        );
    }
}
