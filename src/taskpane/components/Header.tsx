import * as React from 'react';

export interface HeaderProps {
    title: string;
    logo: string;
    message: string;
}

export default class Header extends React.Component<HeaderProps> {
    render() {
        const {
            title,
            logo,
            message
        } = this.props;

        return (
            <section className='ms-welcome__header ms-bgColor-neutral ms-u-fadeIn500'>
                <img width='100' height='100' src={logo} alt={title} title={title} />
                <h1 className='ms-fontSize-40px ms-fontColor-blue'><b>{message}</b></h1>
            </section>
        );
    }
}
