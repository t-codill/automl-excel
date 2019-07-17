import * as React from 'react';
import Header from "./Header";
import { PrimaryButton } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';

interface WelcomeProps {
}

interface WelcomeState {
} 

export default class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  render() {

    const buttonStyle = {
      marginLeft: 5,
      marginRight: 5
    };

    return (
      <div className = 'welcome'>
        <Header logo='/assets/azuremachinelearninglogo.png' title={"Logo"} message='Automated Machine Learning' />
        <div className="center">
            <Link to='/tutorial/importdata'><PrimaryButton style={buttonStyle}>Tutorial</PrimaryButton></Link> <br></br>
            <Link to='/createmodel'><PrimaryButton style={buttonStyle}>Create Model</PrimaryButton></Link>
            <Link to='/run'><PrimaryButton style={buttonStyle}>Apply Model</PrimaryButton></Link>
        </div>
      </div>
    );
  }
}
