import * as React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'office-ui-fabric-react';
       
interface TrainingProps {
}
interface TrainingState {

} 

export default class ModelAnalysis extends React.Component<TrainingProps, TrainingState> {



render() {
    

    return (
      <>
      <div className = 'ms-training'>
          <h1>&nbsp;&nbsp;Test12345</h1>
          <h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your best model.</h5>

      </div>
      <div className = 'ms-training-accuracy'>
        <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;98% Accurate</b>
      </div>

      {/* buttons to various pages */}
      <div className = 'ms-training-buttons'>
      
          <Button style = {{width: 250, height: 40}}>
            <p> View Training in Azure </p>
          </Button>
        
         <br></br>
         <br></br>
         <br></br>
       
          <Link to = "/ModelAnalysis">
          <Button style = {{width: 250, height: 30}}>
            <p> Model Analysis of <i>TestMdl</i> </p>
          </Button>
          </Link>
      </div>

      </>
    );
}

}

// import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
// import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
// import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
// import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
// import {Link} from 'react-router-dom';

// const exampleChildClass = mergeStyles({
//   display: 'block',
//   marginBottom: '10px'
// });

// export interface TrainingProps {
//   key: number;
//   name: any;
//   status: string;
//   percentage: string;
//   duration: string;
//   created: string;
// }

// export interface TrainingState {
//   items: TrainingProps[];
//   selectionDetails: {};
// }

// export default class DetailsListBasicExample extends React.Component<{}, TrainingState> {
//   private _selection: Selection;
//   private _allItems: TrainingProps[];
//   private _columns: IColumn[];

//   constructor(props: {}) {
//     super(props);

//     this._selection = new Selection({
//       onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
//     });

//     // Populate with items for demos.
//     this._allItems = [];
//     for (let i = 0; i < 10; i++) {
//       this._allItems.push({
//         key: i,
//         name: 
//         <Link to = "./ModelAnalysis">
//         Example
//         </Link>,
//         status: "Completed",
//         percentage: "100%",
//         duration: "00:00:00",
//         created: "7/12/19, 23:00:00"
//       });
//     }

//     this._columns = [
//       { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 75, maxWidth: 75, isResizable: true },
//       { key: 'column2', name: 'Accuracy', fieldName: 'percentage', minWidth: 80, maxWidth: 80, isResizable: true },
//       { key: 'column3', name: 'Status', fieldName: 'status', minWidth: 80, maxWidth: 80, isResizable: true },
//       { key: 'column4', name: 'Duration', fieldName: 'duration', minWidth: 80, maxWidth: 80, isResizable: true },
//       { key: 'column5', name: 'Created', fieldName: 'created', minWidth: 80, maxWidth: 80, isResizable: true }
//     ];

//     this.state = {
//       items: this._allItems,
//       selectionDetails: this._getSelectionDetails()
//     };
//   }

//   public render(): JSX.Element {
//     const { items, selectionDetails } = this.state;

//     return (

//       <Fabric>
//           <div className = "ms-training__Header">Run is <b>Completed</b></div>
//         <div className={exampleChildClass}>{selectionDetails}</div>
     
//         <MarqueeSelection selection={this._selection}>
//           <DetailsList
//             items={items}
//             columns={this._columns}
//             setKey="set"
//             layoutMode={DetailsListLayoutMode.justified}
//             selection={this._selection}
//             selectionPreservedOnEmptyClick={true}
//             ariaLabelForSelectionColumn="Toggle selection"
//             ariaLabelForSelectAllCheckbox="Toggle selection for all items"
//             onItemInvoked={this._onItemInvoked}
//           />
//         </MarqueeSelection>
//       </Fabric>
//     );
//   }

//   private _getSelectionDetails(): string {
//     const selectionCount = this._selection.getSelectedCount();

//     switch (selectionCount) {
//       case 0:
//         return '';
//       case 1:
//         return '';
//       default:
//         return '';
//     }
//   }



//   private _onItemInvoked = (item: TrainingProps): void => {
//     alert(`Item invoked: ${item.name}`);
//   };
// }