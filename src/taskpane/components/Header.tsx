import * as React from 'react';

export interface HeaderProps {
    logo: string;
    message1: string;
    message2: string;
}

export default class Header extends React.Component<HeaderProps> {
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