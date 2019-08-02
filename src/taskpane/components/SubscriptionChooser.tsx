import React from "react";
import { AppContext } from "./AppContext";
import { Dropdown, PrimaryButton } from "office-ui-fabric-react";
import { IDropdownOption } from "@vienna/data-prep-lib/Common/Common-models";
import { PageLoad } from "./PageLoad";

interface ISubscriptionChooserState {
    subscriptionId: string;
}

export class SubscriptionChooser extends React.Component<{}, ISubscriptionChooserState>{
    static contextType = AppContext;

    constructor(props){
        super(props);

        this.state = {
            subscriptionId: null
        }
        
    }

    public componentDidMount(){
        if(this.context.subscriptionList === null){
            this.context.updateSubscriptionList();
        }
        
    }

    public onChange(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption){
        this.setState({
            subscriptionId: option.value
        });
        
    }

    public onSubmit(){
        
        this.context.update({
            subscriptionId: this.state.subscriptionId,
            workspaceList: null
        });
    }

    public render(){
        if(this.context.subscriptionList === null){
            return <PageLoad text="Loading subscription list" />
        }

        return <>
            <Dropdown placeholder="Choose a subscription" label="Choose a subscription" onChange={this.onChange.bind(this)} options={this.context.subscriptionList.map(subscription => { return {key: subscription.subscriptionId, text: subscription.displayName, value: subscription.subscriptionId}})}></Dropdown>
            <PrimaryButton onClick={this.onSubmit.bind(this)}>Done</PrimaryButton>
        </>
    }

}