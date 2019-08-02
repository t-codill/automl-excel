import * as React from 'react';
import { Dropdown, IDropdownOption, ResponsiveMode } from 'office-ui-fabric-react/lib/Dropdown';
import { AppContext } from './AppContext';
import { AzureMachineLearningWorkspacesModels } from '@azure/arm-machinelearningservices';
import { Spinner } from 'office-ui-fabric-react';

interface SEMProps {
}
export interface SEMState {
    selectedItem?: { key: string | number | undefined };
} 

export default class Run extends React.Component<SEMProps, SEMState> {
    contextType = AppContext;

    public state: SEMState = {
        selectedItem: undefined
    };

    constructor(props, context){
      super(props, context);
      
    }

    componentDidMount(){
      if(this.context.workspaceList === null)
        this.context.updateWorkspaceList();
    }

    updateState(newState): Promise<void>{
      return new Promise((resolve, reject) => {
        this.setState(newState, () => {
          resolve();
        })
      })
    }

    render() {
        const { selectedItem } = this.state;

        if(this.context.workspaceList == null){
          return <Spinner style={{marginTop: 100}}></Spinner>
        }

        console.log(this.context.workspaceList);
        const options = this.context.workspaceList.map((workspace: AzureMachineLearningWorkspacesModels.Workspace) => {
          return {key: workspace.id, text: workspace.name};
        })


        return (
          <div className = 'welcome center'>
          
            <h2>Show Existing Models.</h2>
            <div style={{textAlign: 'center', width: '100%'}}>
              <Dropdown
                label="Pre-Existing Model to Use"
                selectedKey={selectedItem ? selectedItem.key : undefined}
                onChange={this._onChange}
                placeholder="Select an option"
                options={options}
                styles={{ dropdown: { width: 300, marginLeft: 'auto', marginRight: 'auto' } }} responsiveMode={ResponsiveMode.xLarge}
              />
            </div>
        
            <h3> Input Field</h3>
            <h3> Output Field</h3>
          </div>
        );

    }


  private _onChange = (_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    console.log(`Selection change: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);
    this.setState({ selectedItem: item });
  };
}

Run.contextType = AppContext;