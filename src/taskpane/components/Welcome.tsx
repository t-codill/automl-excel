import * as React from 'react';
import { DefaultButton, PrimaryButton, IButtonStyles } from 'office-ui-fabric-react';
import { Separator, ISeparatorStyles } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';


export interface HeaderProps {
    logo: string;
    message1: string;
    message2: string;
}

class Header extends React.Component<HeaderProps> {
    render() {
        const {
            logo,
            message1,
            message2
        } = this.props;

        return (
            <section className='welcome-header ms-bgColor-neutral ms-u-fadeIn500'>
                <img width='175' height='175' src={logo} />
                <h1 className='welcome-title'>{message1}<br/>{message2}</h1>
            </section>
        );
    }
}


const buttonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '10px',
            width: '94%',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

const SeparatorStyle: Partial<ISeparatorStyles> = {
    root: { marginTop: '10px' }
};

export default class Welcome extends React.Component {

    render() {

        return (
            <div>
                <Header  
                    logo='/assets/azuremachinelearninglogo.png' 
                    message1='Azure'
                    message2='Automated Machine Learning'/>
                <div>
                    <p className='welcome-text'> New to automated machine learning? Start with a tutorial with step-by-step insturctions. </p>
                    <Link to='/tutorial/importdata'>
                        <DefaultButton styles={buttonStyle}>Start Tutorial</DefaultButton></Link>
                    <Separator styles={SeparatorStyle}/>
                    <p className='welcome-text'> Create a model using your data, and apply your model to generate predictions. </p>
                    <Link to='/createmodel'>
                        <PrimaryButton styles={buttonStyle}>Create Model</PrimaryButton></Link>
                    <Link to='/applymodel'>
                        <PrimaryButton styles={buttonStyle}>Apply Model</PrimaryButton></Link>
                </div>
            </div>
        );
    }
}
