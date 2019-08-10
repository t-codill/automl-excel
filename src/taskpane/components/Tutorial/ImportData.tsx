import * as React from 'react';
import { IconButton, PrimaryButton, IButtonStyles } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'
import { sampleData } from './SampleData.js';

const backButtonStyle: Partial<IButtonStyles> = {
    root: { color: 'white', 
            display: 'inline-block', 
            width: '30px', 
            paddingTop: '7px' }   
}

const nextButtonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: '5px' }
}

export default class ImportData extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._createTable();
    }

    //creates a new sheet names 'Titanic' and imports titanic passenger survival data
    private _createTable() {
        Excel.run(async context => {
            var sheets = context.workbook.worksheets;
            var sheet = sheets.add('Titanic')
            sheet.activate();

            var titanicTable = sheet.tables.add("A1:K1", true /*hasHeaders*/);
            titanicTable.name = "table";
    
            titanicTable.getHeaderRowRange().values =
            [["passenger class", "name", "sex", "age", "sibling/spouse", "parent/child", "ticket", "fare", "embarked", "home", "survived"]];
        
            titanicTable.rows.add(null /*add at the end*/, sampleData);

            titanicTable.columns.getItemAt(7).getRange().numberFormat = [['0.00']];
            titanicTable.getRange().format.horizontalAlignment = 'Left'
            titanicTable.getRange().format.autofitColumns();
            titanicTable.getRange().format.autofitRows();

            await context.sync();
        })
    }
     
    render() {

        return (
            <div>
                <div className="header">
                    <Link style={{position: 'absolute', left: 0}} to="/">
                        <IconButton styles={backButtonStyle} iconProps={{ iconName: 'ChromeBack'}}/>
                    </Link>
                    <span className='header_text'> Tutorial: Prepare Data </span>
                </div>
                <p className='tutorial_title'> Predicting Survival of Titanic Passangers </p>
                <p className='tutorial_text'> We will create a machine learning model that predicts the survival of Tatanic passangers based on their passenger information (passanger class, sex, age, etc.). </p> 
                <Link to='/tutorial/outputfield'>
                    <PrimaryButton styles={nextButtonStyle} text="next" />
                </Link>
            </div>
        );
    }
}