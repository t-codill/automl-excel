import * as React from 'react';
import Header from "./Header";
import { PrimaryButton } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';

       
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

        const buttonStyle = {
            marginLeft: 5,
            marginRight: 5
        };

        return (
            <div className = 'welcome'>
                <Header logo='/assets/azuremachinelearninglogo.png' title={"Logo"} message='Automated Machine Learning' />
                <div className="center">
                    <h2>Welcome.</h2>
                    <h5>This tool allows you to apply existing models to your dataaaaaaa, or create new models to make predictions. hi coleman</h5>
                    <Link to='/train'><PrimaryButton style={buttonStyle}>Train Model</PrimaryButton></Link>
                    <Link to='/run'><PrimaryButton style={buttonStyle}>Use Model</PrimaryButton></Link>
                </div>
            </div>
        );
    }

}


