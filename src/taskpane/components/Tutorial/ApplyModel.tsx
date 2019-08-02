import * as React from 'react';
import { Dropdown, IDropdownStyles } from 'office-ui-fabric-react';
import { PrimaryButton, IconButton, IIconStyles, IButtonStyles, CommandBarButton } from 'office-ui-fabric-react';
import { MessageBar, MessageBarType, IMessageBarStyles} from 'office-ui-fabric-react';
import { Stack, TextField, IStackProps } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';

interface AppProps {
}

interface AppState {
    inputFields: string[]
    outputField: string
    inputFieldsView: boolean
    outputFieldView: boolean
    selectedRange: string,
    showError: boolean
} 

const options = [
    { key: 'Titanic Passenger Survival', text: 'Titanic Passenger Survival' },
];

const messageBarStyle: Partial<IMessageBarStyles> = {
    innerText: { position: 'relative',
                 marginTop: '-1px' }
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

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            width: '30px', 
            paddingTop: '7px' }   
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
    
    private inputFieldsWindow;
    private outputFieldWindow;

    constructor(props, context) {
        super(props, context);
        this.inputFieldsWindow = React.createRef();
        this.outputFieldWindow = React.createRef();
        this.state = {
            inputFields: ["passenger class", "name", "sex", "age", "sibling/spouse", "parent/child", "ticket", "fare", "embarked", "home"],
            outputField: 'survived',
            inputFieldsView: false,
            outputFieldView: false,
            selectedRange: 'Select the range and click on the table button on the right',
            showError: false,
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

    click = async () => {
        try {
            await Excel.run(async context => {
                const range = context.workbook.worksheets.getActiveWorksheet().getRange(this.state.selectedRange)
                range.load('columnCount, values')

                await context.sync();
                const nCol = range.columnCount;
                if (nCol !== 11 && nCol !== 10) {
                    this.setState({
                        showError: true
                    })
                    return 
                }
                
                const nLastCol = this.state.selectedRange.split(':')[1][0]
                console.log('nCol: ' + nCol + ' LastCol: ' + nLastCol)
                if ((nCol == 10 && nLastCol == 'J') || (nCol == 11 && nLastCol == 'K')) {
                    const lastCol = nCol === 10 ? range.getColumnsAfter(1) : range.getLastColumn();
                    const newCol = lastCol.getColumnsAfter(1);
                    const colHeader = context.workbook.worksheets.getActiveWorksheet().getRange('L1')
                    lastCol.load('values');
                    newCol.load("rowCount, values, address");
                    colHeader.load('values')

                    await context.sync();
                    const nRows = newCol.rowCount;
                    const prediction = []
                    for (var i = 0; i < nRows; i++) {
                        if (newCol.values[i][0] == '') {
                            if (range.values[i][3] !== '') {
                                var original = lastCol.values[i][0];
                                prediction.push([Math.random() > 0.3 ? original : 1 - original]);
                            } else {
                                prediction.push([''])
                            }
                        } else {
                            prediction.push([newCol.values[i][0]])
                        }
                    }
                    newCol.values = prediction
                    colHeader.values = [['predicted-survived']]
                    newCol.format.autofitColumns();
                    this.setState({
                        showError: false
                    })
                } else {
                    this.setState({
                        showError: true
                    })
                }
            });
        } catch (error) {
            console.error(error);
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
        const error = this.state.showError 
            ? <MessageBar 
                messageBarType={MessageBarType.error}
                styles={messageBarStyle}> The selected range does not include all input fields of the model </MessageBar>
            : null

        return (
            <div>          
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/tutorial/analysis" >
                    <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/></Link>
                    <span className='header_text'> Tutorial: Apply Existing Model </span>
                </div>
                {error}
                <p className='training-text-with-margin'> To generate predictions, you need to specify the <b>range for predictions</b>. The range must contain all input columns of the model. </p>
                <Dropdown
                    label="Which model would you like to use?"
                    defaultSelectedKey='Titanic Passenger Survival'
                    options={options}
                    styles={dropdownStyle}
                    disabled={true}/>    
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
                <PrimaryButton styles={buttonStyle} onClick={this.click.bind(this)} text="Generate Predictions" />
            </div>
        );
    }
}