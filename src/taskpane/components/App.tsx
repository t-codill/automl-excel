import { AzureMachineLearningWorkspacesModels } from '@azure/arm-machinelearningservices';
import { SubscriptionModels } from "@azure/arm-subscriptions";
import * as React from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { SubscriptionService } from '../../automl/services/SubscriptionService';
import { WorkSpaceService } from '../../automl/services/WorkSpaceService';
import { AuthenticationService } from "../AuthenticationService";
import { AppContext, IAppContextProps, appContextDefaults } from './AppContext';
import "office-ui-fabric-react/dist/css/fabric.css"
import Train from './Train';
import Welcome from './Welcome';
import Run from './Run';
import TutorialImportData from './TutorialImportData'
import TutorialTrain1 from './TutorialTrain1';
import TutorialTrain2 from './TutorialTrain2';
import TutorialTraining from './TutorialTraining';
import ModelAnalysis from './ModelAnalysis';

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  token: string;
  subscriptionList: SubscriptionModels.Subscription[];
  workspaceList: AzureMachineLearningWorkspacesModels.Workspace[];
  appContext: IAppContextProps;
}

export default class App extends React.Component<AppProps, AppState> {

  async updateData(){
    await this.updateToken();
    let subscriptionList = await new SubscriptionService(this.state.appContext.serviceBaseProps).listSubscriptions();
    let subscriptionId = subscriptionList[0].subscriptionId;

    let serviceBaseProps = {
      ...this.state.appContext.serviceBaseProps,
      subscriptionId: subscriptionId
    }
    
    this.setState({
      subscriptionList: subscriptionList,
      appContext: {
        ...this.state.appContext,
        serviceBaseProps: serviceBaseProps
      }
    });
    let workspaceList = await new WorkSpaceService(serviceBaseProps).listWorkspaces();
    this.setState({
      workspaceList: workspaceList
    });
  }

  constructor(props, context) {
    super(props, context);

    let appContext = appContextDefaults;
    appContext.serviceBaseProps.getToken = function(){
      return this.state.token;
    }.bind(this);

    this.state = {
      token: "",
      subscriptionList: null,
      workspaceList: null,
      appContext: appContext
    };
    
    this.updateData();
  }

  updateToken = async () => {
    this.setState({
      token: await AuthenticationService.getToken()
    });
  }

  render(){

    const showLists = false;

    function renderPage(props){
      let subList;
      if(this.state.subscriptionList === null){
        subList = <p>Waiting for subscription list...</p>;
      }else{
        subList = [];
        this.state.subscriptionList.forEach((subscription: SubscriptionModels.Subscription) => {
          subList.push(<p key={subscription.id}>{subscription.displayName} - {subscription.id} - {subscription.subscriptionId}</p>);
        });
      }

      let workspaceList: JSX.Element[];
      if(this.state.workspaceList === null){
        workspaceList = [<p key="">Waiting for workspace list...</p>];
      }else{
        workspaceList = []
        this.state.workspaceList.forEach((workspace: AzureMachineLearningWorkspacesModels.Workspace) => {
          workspaceList.push(<p key={workspace.id}>{workspace.name} - {workspace.friendlyName}</p>);
        });
      }

      return (
        <div>
          {subList}
          <br />
          {workspaceList}
        </div>
      )
    }

    let RenderPage = showLists ? renderPage.bind(this)({}): <></>;

    return (
      <AppContext.Provider value={this.state.appContext}>
        
        <BrowserRouter basename="/taskpane">
          <Switch>
            <Route path="/train" component={Train}></Route>
            <Route path="/run" component={Run}></Route>
            <Route path="/tutorialtrain1" component={TutorialTrain1}></Route>
            <Route path="/tutorialtrain2" component={TutorialTrain2}></Route>
            <Route path="/tutorialimportdata" component={TutorialImportData}></Route>
            <Route path="/tutorialtraining" component={TutorialTraining}></Route>
            <Route path = "/ModelAnalysis" component={ModelAnalysis}></Route>
            <Route exact path='/' component={Welcome}></Route>
          </Switch>
        </BrowserRouter>
        {RenderPage}
      </AppContext.Provider>
    )
  }
}
