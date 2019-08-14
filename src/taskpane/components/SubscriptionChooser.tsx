import React from "react";
import { AppContext, AppContextState } from "./AppContext";
import { Separator, ISeparatorStyles } from 'office-ui-fabric-react'
import { Checkbox, ICheckboxStyles } from 'office-ui-fabric-react'
import { Dropdown, IDropdownStyles, IDropdownOption, ResponsiveMode } from 'office-ui-fabric-react'
import { PrimaryButton, IButtonStyles } from 'office-ui-fabric-react'
import { TextField, Stack, IStackProps } from 'office-ui-fabric-react'
import { updateState } from './util';
import { AzureMachineLearningWorkspacesModels } from '@azure/arm-machinelearningservices';
import { ResourceManagementModels } from '@azure/arm-resources';
import { ResourceGroup } from '@azure/arm-resources/esm/models';
import { PageLoad } from "./PageLoad";

interface ISubscriptionChooserState {
    createNewWorkspace: boolean,
    resourceGroupOptions: IDropdownOption[],
    resourceGroupChoice: string,
    newWorkspaceName: string,
    invalidWorkspaceName: boolean
}

const SeparatorStyle: Partial<ISeparatorStyles> = {
    root: { marginTop: '6px' }
};

const dropdownStyle: Partial<IDropdownStyles> = {
    root: { paddingLeft: '5px',
            paddingRight: '5px',
            paddingTop: '6px'}
};

const dropdownStyle2: Partial<IDropdownStyles> = {
    root: { paddingLeft: '5px',
            paddingRight: '5px',
            paddingBottom: '2px' }
}

const columnProps: Partial<IStackProps> = {
    styles: { root: { marginLeft: '5px',
                      marginRight: '5px',
                      marginTop: '6px'}
            }
}

const checkboxStyle: Partial<ICheckboxStyles> = {
    label: { marginLeft: 'auto',
            marginRight: '5px' },
    checkbox: { position: 'relative',
                height: '15px',
                width: '15px',
                marginTop: '2px' },
}

const buttonStyle: Partial<IButtonStyles> = {
    root: { display: 'block',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto' }
}

export class SubscriptionChooser extends React.Component<{}, ISubscriptionChooserState>{
    static contextType = AppContext;

    constructor(props){
        super(props);

        this.state = {
            createNewWorkspace: false,
            resourceGroupOptions: [],
            resourceGroupChoice: null,
            newWorkspaceName: null,
            invalidWorkspaceName: true
        }        
    }

    componentDidMount(){
        let context: AppContextState = this.context;
        if(this.context.subscriptionList === null){
            this.context.updateSubscriptionList();
        }else{
            context.updateWorkspaceList();
        }
    }

    async onChange(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption){
        let context: AppContextState = this.context;
        context.setSubscriptionId(option.data)
        await this.context.updateWorkspaceList();

        // let createNewWorkspace = context.workspace === null;
        
        // await updateState(this, {
        //     createNewWorkspace
        // });

        let resourceGroups = await this.context.getResourceGroupsBySubscription(this.context.subscriptionId);
        let resourceGroupOptions = resourceGroups.map((resourceGroup: ResourceGroup): IDropdownOption => {
            return {
                text: resourceGroup.name,
                key: resourceGroup.name,
                data: resourceGroup
            }
        });
        await updateState(this, {
            resourceGroupOptions: resourceGroupOptions
        });
    }

    async onSubmit(){
        let context: AppContextState = this.context
        let resourceGroupName: string;
        let workspace: AzureMachineLearningWorkspacesModels.Workspace;

        if (this.state.createNewWorkspace) {
            console.log("Make workspace with resource group ".concat(this.state.resourceGroupChoice).concat(" and name ").concat(this.state.newWorkspaceName))
            let result: ResourceManagementModels.DeploymentExtended = await this.context.createWorkspace(this.state.newWorkspaceName, this.state.resourceGroupChoice);
            console.log('Result: ' + result);
            resourceGroupName = this.state.resourceGroupChoice;
            workspace = this.context.getWorkspace(resourceGroupName, this.state.newWorkspaceName);
            await this.context.setWorkspace(workspace)
        } else {
            workspace = context.workspace;
            resourceGroupName = workspace.id.split("resourceGroups/")[1].split("/")[0];
            console.log("Resource group:");
            console.log(resourceGroupName);
            await this.context.setWorkspace(workspace);
        }
        context.update({
            settingCompleted: true
        });
    }

    buttonDisabled(): boolean {
        if (this.state.createNewWorkspace) {
            return this.state.invalidWorkspaceName || this.state.resourceGroupChoice === null
        } else {
            return this.context.workspace === null
        }
    }

    onWorkspaceNameChange(e, newVal) {
        var condition = /^[A-z0-9][A-z0-9-]{2,32}$/
        if (newVal.match(condition)) {
            this.setState({
                newWorkspaceName: newVal,
                invalidWorkspaceName: false
            })
        } else {
            this.setState({
                newWorkspaceName: null,
                invalidWorkspaceName: true
            })
        }
    }

    _getWorkspaceErrorMessage(value: string) {
        if (this.state.invalidWorkspaceName) {
            return 'Name must be between 3 and 33 characters, start with an alphanumeric character, and only include alphanumeric characters and \-';
        }
        return ''
    }

    public render(){
        let context: AppContextState = this.context;
        console.log(`subscription list = ${this.context.subscriptionList}`);
        if(!context.subscriptionList){
            return <PageLoad text="Loading subscription list" />
        }
        let workspaceChooser = null;

        if(context.workspaceList !== null){
            
            workspaceChooser = <>
                    <Separator styles={SeparatorStyle}/>
                    <Dropdown
                        placeholder="Select workspace"
                        defaultSelectedKey={context.workspace === null ? undefined : context.workspace.id}
                        label="Select workspace to use"
                        options={this.context.workspaceList.map((workspace: AzureMachineLearningWorkspacesModels.Workspace): IDropdownOption => { return {
                                key: workspace.id,
                                text: workspace.friendlyName,
                                data: workspace
                            }})}
                        responsiveMode={ResponsiveMode.xLarge}
                        styles={dropdownStyle2}
                        disabled={this.state.createNewWorkspace}
                        onChange={(event, option?) => {context.setWorkspace(option.data)}} />
                    <Checkbox 
                        defaultChecked={this.state.createNewWorkspace} 
                        label="Create a new workspace" 
                        styles={checkboxStyle}
                        onChange={(ev?, checked?) => this.setState({createNewWorkspace: checked})} />
                        {
                            this.state.createNewWorkspace ?
                            <>
                            <Stack {...columnProps} >
                                <TextField 
                                    label="Enter a new workspace name" 
                                    placeholder="excel-automl" 
                                    onGetErrorMessage={this._getWorkspaceErrorMessage.bind(this)} 
                                    onChange={this.onWorkspaceNameChange.bind(this)} />
                            </Stack>    
                            <Dropdown
                                    label="Select resource group to use"
                                    placeholder="Select resource group"
                                    styles={dropdownStyle2}
                                    responsiveMode={ResponsiveMode.xLarge}
                                    options={this.state.resourceGroupOptions}
                                    onChange={(event, option?) => this.setState({ resourceGroupChoice: option.key as string })} />
                            </>
                            : <></>
                        }
                </>;
        }

        return <>
            <div className="header">
                <span className='header_text'> Select Subscription/Workspace </span>
            </div>
            <Dropdown 
                label="Select subscription to use"
                placeholder="Select subscription" 
                styles={dropdownStyle}
                responsiveMode={ResponsiveMode.xLarge}
                onChange={this.onChange.bind(this)} 
                options={this.context.subscriptionList.map(subscription => 
                    { return {key: subscription.subscriptionId, text: subscription.displayName, data: subscription.subscriptionId}})}></Dropdown>
            { workspaceChooser }
            <PrimaryButton 
                onClick={this.onSubmit.bind(this)} 
                styles={buttonStyle}
                disabled={this.buttonDisabled()}>Done</PrimaryButton>
        </>
    }
}