import * as React from 'react';
import '../taskpane.css'
import { IconButton, PrimaryButton, IButtonStyles } from 'office-ui-fabric-react'
import { Link } from 'react-router-dom'

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

export default class TutorialTrain extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._createTable();
    }
    private _createTable() {
        Excel.run(async context => {
            var currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
            var titanicTable = currentWorksheet.tables.add("A1:H1", true /*hasHeaders*/);
            titanicTable.name = "WineTable";
    
            titanicTable.getHeaderRowRange().values =
            [["Passenger Class", "Sex", "Age", "Sibling/Spouse", "Parent/Child", "FarePrice", "Port Embarkation", "Survived"]];
        
            titanicTable.rows.add(null /*add at the end*/, [
                ["3", "female", "38", "1", "5", "31.3875", "S", "1"],
                ["3", "male", "3", "4", "2", "31.3875", "S", "1"],
                ["3", "male", "25", "1", "0", "17.8", "S", "0"],
                ["2", "female", "30", "0", "0", "12.35", "Q", "1"],
                ["2", "male", "31", "1", "1", "37.0042", "C", "0"],
                ["2", "female", "24", "1", "0", "27.7208", "C", "1"],
                ["1", "female", "60", "1", "0", "75.25", "C", "1"],
                ["1", "male", "17", "0", "2", "110.8833", "C", "1"],
                ["2", "female", "36", "0", "3", "39", "S", "1"],
                ["1", "male", "45", "0", "0", "26.55", "S", "1"],
                ["1", "male", "30", "0", "0", "27.75", "C", "0"],
                ["1", "male", "64", "1", "4", "263", "S", "0"],
                ["1", "female", "33", "1", "0", "90", "Q", "1"],
                ["1", "male", "58", "0", "2", "113.275", "C", "0"],
                ["1", "female", "19", "0", "2", "26.2833", "S", "1"],
                ["1", "male", "64", "0", "0", "26", "S", "0"],
                ["1", "female", "39", "0", "0", "108.9", "C", "1"],
                ["2", "female", "34", "1", "1", "32.5", "S", "1"],
                ["2", "female", "27", "1", "0", "13.8583", "C", "1"],
                ["2", "female", "30", "1", "0", "13.8583", "C", "1"],
                ["2", "male", "23", "0", "0", "13", "S", "0"],
                ["2", "male", "35", "0", "0", "12.35", "Q", "0"],
                ["2", "female", "45", "0", "0", "13.5", "S", "1"],
                ["2", "male", "57", "0", "0", "12.35", "Q", "0"],
                ["2", "male", "39", "0", "0", "26", "S", "0"],
                ["2", "male", "16", "0", "0", "10.5", "S", "0"],
                ["2", "male", "62", "0", "0", "9.6875", "Q", "0"],
                ["2", "male", "32", "1", "0", "30.0708", "C", "0"],
                ["2", "female", "14", "1", "0", "30.0708", "C", "1"],
                ["3", "female", "13", "0", "0", "7.2292", "C", "1"],
                ["3", "male", "20", "0", "0", "7.225", "C", "0"],
                ["3", "male", "32", "1", "0", "15.85", "S", "0"],
                ["3", "female", "33", "3", "0", "15.85", "S", "1"],
                ["3", "male", "32", "0", "0", "7.925", "S", "0"],
                ["3", "male", "34", "0", "0", "6.4375", "C", "0"]
            ]);
            titanicTable.columns.getItemAt(5).getRange().numberFormat = [['0.00']];
            titanicTable.columns.getItemAt(1).getRange().format.horizontalAlignment = 'Right';
            titanicTable.columns.getItemAt(6).getRange().format.horizontalAlignment = 'Right';
            titanicTable.getHeaderRowRange().format.horizontalAlignment = 'Left'
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
                <p className='tutorial_text'> In this tutorial, we will create a machine learning model that predicts the survival of Tatanic passangers based on their passenger information (passanger class, sex, age, etc.). </p> 
                <Link to='/tutorialTrain1'>
                    <PrimaryButton styles={nextButtonStyle} text="next" />
                </Link>
            </div>
        );
    }
}