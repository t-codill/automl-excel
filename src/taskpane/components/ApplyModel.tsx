import * as React from 'react';
import { Dropdown, IDropdownStyles, IDropdownOption, ResponsiveMode } from 'office-ui-fabric-react';
import { PrimaryButton, IconButton, IIconStyles, IButtonStyles, CommandBarButton } from 'office-ui-fabric-react';
import { Stack, TextField, IStackProps } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';
import { AppContextState, AppContext } from './AppContext';
import { updateState } from './util';
import { IRunDtoWithExperimentName } from '../../automl/services/RunHistoryService';

interface AppProps {
}

interface AppState {
    inputFields: string[];
    outputField: string;
    inputFieldsView: boolean;
    outputFieldView: boolean;
    trainedRuns: IRunDtoWithExperimentName[];
    selectedRange: string;
} 

const windowButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'black', 
            display: 'inline-block', 
            height: '30px',
            paddingTop: '7px',
            paddingBottom: '2px',
            backgroundColor: '#ffffff',
            paddingLeft: '5px' }   
}

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            paddingTop: '7px' }   
}

const rangeButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'inline-block',
            float: 'right',
            marginRight: '5px',
            marginTop: '-32px',
            backgroundColor: '#eeeeee' }   
}

const tableIconStyle: Partial<IIconStyles> = {
    root: { color: '#0078d4',
            fontSize: '20px' }   
}

const columnProps: Partial<IStackProps> = {
    styles: { root: { marginLeft: '5px',
                      marginRight: '43px',
                      marginTop: '6px'}
            }
}

const dropdownStyle: Partial<IDropdownStyles> = {
    root: { paddingLeft: '5px',
            paddingRight: '5px',
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
    static contextType = AppContext;
    
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
            outputFieldView: false,
            trainedRuns: [],
            selectedRange: 'Select the range and click on the table button on the right'
        }

    }

    async componentDidMount(){
        
        try{
            await this.reloadTrainedRuns();
            }catch(err){console.log(err)}
    }

    private async reloadTrainedRuns(){
        let context: AppContextState = this.context;
        console.log("Trained runs:")
        let trainedRuns = await context.listTrainedRuns();
        console.log(trainedRuns);
        await updateState(this, {
            trainedRuns
        });
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

    private _onClick = async() => {
        await Excel.run(async context => {
            var range = context.workbook.getSelectedRange();
            range.load('address')

            await context.sync();
            this.setState({
                selectedRange: range.address
            })
        })
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
                <Stack {...columnProps}>
                    <TextField 
                        label="Select the range to generate predictions" 
                        readOnly
                        value={this.state.selectedRange}/>
                </Stack>
                <IconButton 
                    styles={rangeButtonStyle}
                    iconProps={{ iconName: 'Table', styles: {...tableIconStyle}}}
                    onClick={this._onClick.bind(this)}/>
                <PrimaryButton 
                    disabled={this.state.selectedRange === ''}
                    styles={buttonStyle} 
                    text="Generate Predictions" />
                
                <p>Trained models:</p>
                    {
                        this.state.trainedRuns.map((run: IRunDtoWithExperimentName) => {
                            console.log("a run:");
                            console.log(run);
                            return <p>{run.experimentName} - {run.status}</p>
                        })
                    }
            </div>
        );
    }
}