import * as React from 'react';
import { PrimaryButton, Checkbox, IChoiceGroupOption, ResponsiveMode, IDropdownOption } from 'office-ui-fabric-react';
import { Dropdown, IDropdownStyles } from 'office-ui-fabric-react';
import { ChoiceGroup } from 'office-ui-fabric-react'
import { IconButton } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom';


export interface AppState {
  selectedKey: string
  headers: any[]
  options: IDropdownOption[]
}

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 250 }
};


export default class Train extends React.Component<{}, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedKey: 'classification', 
            headers: [],
            options: []
        };
        this.updateHeader();
    };

    updateHeader() {
        //dropdown options should be updated whenever the excel sheet is updated
        Excel.run(async context => {
            var sheet = context.workbook.worksheets.getActiveWorksheet();
            var range = sheet.getUsedRange();
            range.load("values")

            await context.sync();
            this.setState ({
                headers: range.values[0],
                options: range.values[0].map(x => {
                    return{'key': x, 'text': x};
                })
            })   
            console.log(this.state.headers)
        });
    }

    render() {
        const content = this.state.selectedKey === 'forecasting' 
            ? <div> 
                <Checkbox className = 'ms-train__checkbox' label = "Is the prediction based on time?" />
            </div>
            : null;

        let buttonStyle = {
            marginTop: '20px',
            display: 'block',
            marginLeft: 'auto', 
            marginRight: 'auto'
        }

        let iconStyle = {
            color: 'white'
        }

        return (
            <div>
                <div className="ms-train__header_block">
                    <Link to="/"><IconButton style={iconStyle} iconProps={{ iconName: 'ChromeBack'}} title="back" ariaLabel="back"/></Link>
                    <span className='ms-train__header'> Create New Model </span>
                </div>
                <div className='ms-train__refresh'>
                    <IconButton  size={5} iconProps={{ iconName: 'refresh'}} title="refresh" ariaLabel="refresh" onClick={this.updateHeader.bind(this)}/>
                    <span className='ms-train__refresh_text'> refresh </span>
                </div>
                <Dropdown className='ms-train__center' placeholder="Select an option" label='What do you want to predict?' options={this.state.options} responsiveMode={ResponsiveMode.xLarge} styles={dropdownStyles} />
                <ChoiceGroup className='ms-train__center' label='Select Type of Problem' onChange={this._onImageChoiceGroupChange.bind(this)} options={[
                    {key: 'classification', text: 'Classification', imageSrc: '/assets/classification.png', selectedImageSrc: '/assets/classificationSelected.png', imageSize: { width: 60, height: 60}},
                    {key: 'forecasting', text: 'Forecasting', imageSrc: '/assets/forecasting.png', selectedImageSrc: '/assets/forecastingSelected.png', imageSize: { width: 60, height: 60}}]}/>
                { content }
                <PrimaryButton style={buttonStyle} data-automation-id="train" allowDisabledFocus={true} text="train" />
            </div>
        );
    }

    //@ts-ignore
    private _onImageChoiceGroupChange(ev: React.SyntheticEvent<HTMLElement>, option: IChoiceGroupOption): void {
        this.setState({
            selectedKey: option.key
        });
    }
}