import * as React from 'react';
import Header from "./Header";
import { PrimaryButton } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';

       
    interface WelcomeProps {
    }
    interface WelcomeState {
        names:Array<string>;
        officeToken: string;
    } 

export default class Welcome extends React.Component<WelcomeProps, WelcomeState> {

    constructor(props){
        super(props);
        /*
        let context: any = Office.context;
        context.auth.getAccessTokenAsync({forceconsent: false},
            function(result){
                console.log("access token:");
                console.log(result)
            })*/
        console.log("Hello world")
        
    }

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
                    <h5>Select Train Model to train a new model, or Use Model to use an existing model!</h5>
                    <Link to='/tutorialimportdata'><PrimaryButton style={buttonStyle}>Tutorial</PrimaryButton></Link> <br></br>
                    <Link to='/train'><PrimaryButton style={buttonStyle}>Train Model</PrimaryButton></Link>
                    <Link to='/run'><PrimaryButton style={buttonStyle}>Use Model</PrimaryButton></Link>
                    
                </div>
            </div>
        );
    }

}


//<Link to='/login'><PrimaryButton style={buttonStyle}>Login</PrimaryButton></Link>