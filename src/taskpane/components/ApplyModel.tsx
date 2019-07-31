import * as React from 'react';
import { Dropdown, IDropdownStyles, IDropdownOption, ResponsiveMode } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton, IconButton, IButtonStyles, CommandBarButton } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';

interface AppProps {
}

interface AppState {
    inputFields: string[]
    outputField: string
    inputFieldsView: boolean
    outputFieldView: boolean
} 

const windowButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'black', 
            display: 'inline-block', 
            height: '30px',
            paddingTop: '7px',
            paddingBottom: '2px',
            backgroundColor: '#ffffff',
            paddingLeft: '10px' }   
}

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            width: '30px', 
            paddingTop: '7px' }   
}

const dropdownStyle: Partial<IDropdownStyles> = {
    root: { paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '6px',
            paddingBottom: '10px' }
};

const buttonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

export default class ApplyModel extends React.Component<AppProps, AppState> {
    
    private inputFieldsWindow;
    private outputFieldWindow;

    constructor(props, context) {
        super(props, context);
        this.inputFieldsWindow = React.createRef();
        this.outputFieldWindow = React.createRef();
        this.state = {
            inputFields: [],
            outputField: '',
            inputFieldsView: false,
            outputFieldView: false
        }
    }

    private _inputFieldsClicked(): void {
        this.setState({
            inputFieldsView: !this.state.inputFieldsView 
        })
        const content = this.inputFieldsWindow.current;
        var i = 1.45 * 14 * this.state.inputFields.length;
        if (!this.state.inputFieldsView) {
            content.style.height = i.toString() + 'px'
            setTimeout(() => content.style.height = 'auto', 301)
        } else {
            content.style.height = i.toString() + 'px'
            setTimeout(() => content.style.height = '0', 10)
        }
    }

    private _outputFieldClicked(): void {
        this.setState({
            outputFieldView: !this.state.outputFieldView 
        })
        const content = this.outputFieldWindow.current;
        var i = this.state.outputField === '' ? 0 : 14; 
        if (!this.state.outputFieldView) {
            content.style.height = i.toString() + 'px'
            setTimeout(() => content.style.height = 'auto', 301)
        } else {
            content.style.height = i.toString() + 'px'
            setTimeout(() => content.style.height = '0', 10)
        }
    }

    //@ts-ignore
    private _onDropdownChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        if (item.key === 'Titanic Passanger Survival' ) {
            this.setState ({
                inputFields: ['Sex', 'Age', 'Sibling/Spouse', 'Parent/Child', 'Fare Price', 'Port Embarkation'],
                outputField: 'Survived'
            })
        } else if (item.key === 'Apple') {
            this.setState ({
                inputFields: ['Color', 'Area', 'Sugar', 'Type'],
                outputField: 'Price'
            })
        }  else if (item.key === 'Car') {
            this.setState ({
                inputFields: ['Company', 'Model', 'Year', 'Type', 'Engine', 'Wheel'],
                outputField: 'Price'
            })
        }
    }

    render() {
        const options = [
          { key: 'Titanic Passanger Survival', text: 'Titanic Passanger Survival' },
          { key: 'Apple', text: 'Apple' },
          { key: 'Car', text: 'Car' }
        ];

        return (
            <div>          
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/" >
                    <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/></Link>
                    <span className='header_text'> Apply Existing Model </span>
                </div>
                <div>
                    <Dropdown
                        label="Which model would you like to use?"
                        placeholder="Select model to use"
                        options={options}
                        styles={dropdownStyle}
                        responsiveMode={ResponsiveMode.xLarge}
                        onChange={this._onDropdownChange.bind(this)} />    
                    <div className='window'>
                        <CommandBarButton 
                            styles={windowButtonStyle} 
                            iconProps={{ iconName: (this.state.inputFieldsView ? 'ChevronDown' : 'ChevronUp')}} 
                            onClick={this._inputFieldsClicked.bind(this)}
                            text="Input Fields"/>
                        <div className='row-hide' ref={this.inputFieldsWindow}>
                            <div className='fields'>
                                {this.state.inputFields.join('\n')}
                            </div>
                        </div>
                    </div>
                    <div className='window'>
                        <CommandBarButton 
                            styles={windowButtonStyle} 
                            iconProps={{ iconName: (this.state.outputFieldView ? 'ChevronDown' : 'ChevronUp')}} 
                            onClick={this._outputFieldClicked.bind(this)}
                            text="Output Field"/>
                        <div className='row-hide' ref={this.outputFieldWindow}>
                            <div className='fields'>
                                {this.state.outputField}
                            </div>
                        </div>  
                    </div>
                    <Link to = "/welcome">
                        <PrimaryButton styles={buttonStyle} text="Generate Predictions" />
                    </Link>
                </div>
            </div>
        );
    }
}