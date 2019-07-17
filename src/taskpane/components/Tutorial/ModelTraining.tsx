import * as React from 'react';
import { IconButton, IButtonStyles } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            width: '30px', 
            paddingTop: '7px' }   
}

export default class ModelTraining extends React.Component {

    render() {
        return (
            <div>
                <div style={{position: 'relative', height: 35, textAlign: 'center'}} className="header_block">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorial/typeofproblem">
                    <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}} ariaLabel="back"/></Link>
                    <span className='header_text'> Tutorial: Model Training </span>
                </div>
                <p className='ms-tutorial__text'> Training in progress page </p>
                <p className='ms-tutorial__text'> TODO: provide status bar and short summary of model </p>
                <p className='ms-tutorial__text'> TODO: provide # of iteration completed / # of total iterations and best metric score overall </p>
            </div>
        );
    }
}