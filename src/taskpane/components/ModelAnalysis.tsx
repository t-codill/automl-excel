

import * as React from 'react';
import TopContributors from './TopContributors';
import {contributedata} from './contributedata.js';
import {Link} from 'react-router-dom';
import {  Button } from 'office-ui-fabric-react';

       
    interface ModelAnalysisProps {
    }
    interface ModelAnalysisState {
  
    } 

export default class ModelAnalysis extends React.Component<ModelAnalysisProps, ModelAnalysisState> {

   

    render() {
        

        return (
            <>
            {/* first bar chart, key stats */}
            <div style = {{height: 260}} className ="ms-model__analysis_keyStats" >
                <h3>&nbsp;&nbsp;How the model was trained</h3>
               &nbsp;
                <h1>&nbsp;&nbsp;5503&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TestMdl</h1>
                <h5>&nbsp;&nbsp;&nbsp;&nbsp; Input Rows Provided&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Model Used&nbsp;&nbsp;&nbsp;&nbsp;</h5>

                <h5>&nbsp;&nbsp;&nbsp;&nbsp;</h5>
                <h1>&nbsp;&nbsp;5503&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.92</h1>
                <h5>&nbsp;&nbsp;&nbsp;&nbsp; Sampled Rows&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Model Quality&nbsp;&nbsp;&nbsp;&nbsp;</h5>

                <h5>&nbsp;&nbsp;&nbsp;&nbsp;</h5>
                <h1>&nbsp;&nbsp;3038&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31</h1>
                <h5>&nbsp;&nbsp;&nbsp;&nbsp; Training Rows&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Iterations Run&nbsp;&nbsp;&nbsp;&nbsp;</h5>
             
          </div>
          {/* second box, where the bar chart goes */}
          
                <TopContributors data = {contributedata} />
                
          {/* third box, binary classification */}
          <div style = {{height: 120}} className = "ms-model__anlaysis_binaryClassification">
          <h3>&nbsp;&nbsp;Model Accuracy</h3>
               &nbsp;
               &nbsp;
               &nbsp;
               <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;68%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;70%</h1>
                <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Precision&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Recall&nbsp;&nbsp;&nbsp;&nbsp;</h3>

          </div>
          {/* fourth box,action */}
          <div style = {{height: 208}} className = "ms-model__analysis_actionItems">
          <br></br>
         <br></br>
         <br></br>
         <br></br>
          <Link to = "/ShowExistingModels">
          <Button style = {{width: 250, height: 40}}>
            <p> Apply Model </p>
          </Button>
          </Link>
         <br></br>
         <br></br>
         <br></br>
       
          <Link to = "/CreateNewModel">
          <Button style = {{width: 250, height: 30}} color = "orange">
            <p> Cancel </p>
          </Button>
          </Link>
          </div>
          </>
        );
    }

}


