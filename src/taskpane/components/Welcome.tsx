import * as React from 'react';
import Header from "./Header";

       
    interface WelcomeProps {
    }
    interface WelcomeState {
  
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
            <h5>This tool allows you to apply existing models to your dataaaaaaa, or create new models to make predictions. hi coleman</h5>
            
            </div>
        );
    }

}


