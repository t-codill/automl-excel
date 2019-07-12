import * as React from 'react';
import '../taskpane.css'
import { IconButton } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';

export default class Train extends React.Component {

    render() {
        return (
            <div>
                <div style={{position: 'relative', height: 35, textAlign: 'center'}} className="ms-train__header_block">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorialtrain">
                    <IconButton style={{color: 'white', display: 'inline-block', width: '30px', paddingTop: '7px'}} iconProps={{ iconName: 'ChromeBack'}} ariaLabel="back"/></Link>
                    <span className='ms-train__header'> Tutorial: Training in progess </span>
                </div>
                <p className='ms-tutorial__text'> Training in progress page </p>
                <p className='ms-tutorial__text'> TODO: provide status bar and short summary of model </p>
                <p className='ms-tutorial__text'> TODO: provide # of iteration completed / # of total iterations and best metric score overall </p>
            </div>
        );
    }
}