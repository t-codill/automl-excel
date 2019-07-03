import * as React from 'react';
import Header from "./Header";
import { PrimaryButton, ButtonType } from 'office-ui-fabric-react';
import {Link, Route} from "react-router-dom";
import ShowExistingModels from './ShowExistingModels';



    //     <div className='ms-welcome'>
      
    //           <Header logo='assets/azuremachinelearninglogo.png' title={this.props.title} message='Azure Machine Learning' />
          
      
    //           <p className='ms-font-l'></p>
    //           <PrimaryButton className='ms-welcome__action' buttonType={ButtonType.hero} iconProps={{ iconName: 'ChevronRight' }}
    //    onClick={this.click}>Create New Model</PrimaryButton>
    //          <p className='ms-font-l'></p>
    //           <h1>test</h1>
            
    interface WelcomeProps {
    }
    interface WelcomeState {
        names:Array<string>;
    } 

export default class Welcome extends React.Component<WelcomeProps, WelcomeState> {

    click = async () => {
        try {
          await Excel.run(async context => {
            /**
             * Insert your Excel code here
             */
            const range = context.workbook.getSelectedRange();
    
            // Read the range address
            range.load("address");
    
            await context.sync();
            console.log(`The range address was ${range.address}.`);
          });
        } catch (error) {
          console.error(error);
        }
      }


    render() {

        return (
            <div className = 'welcome'>
             <Header logo='assets/azuremachinelearninglogo.png' title={"weirdinput"} message='Auto Machine Learning' />
            <h2>Welcome.</h2>
            <h5>This tool allows you to apply existing models to your data, or create new models to make predictions.</h5>
            

           <Route path = "/welcome"> <PrimaryButton className='ms-welcome__action' buttonType={ButtonType.hero} iconProps={{ iconName: 'ChevronRight' }}
               onClick={this.click}><Link to = "/test"><ShowExistingModels />Create New Model</Link></PrimaryButton></Route>
           
            </div>
        );
    }
//  <Route path = "/welcome"><p>test ux</p><Welcome /><Link to="/">Back</Link></Route>
}


