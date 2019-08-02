import { AzureMachineLearningWorkspacesModels } from '@azure/arm-machinelearningservices';
import { SubscriptionModels } from "@azure/arm-subscriptions";
import * as React from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { SubscriptionService } from '../../automl/services/SubscriptionService';
import { WorkSpaceService } from '../../automl/services/WorkSpaceService';
import { AuthenticationService } from "../AuthenticationService";
import { AppContext, IAppContextProps, appContextDefaults } from './AppContext';
import "office-ui-fabric-react/dist/css/fabric.css"
import CreateModel from './createModel';
import Welcome from './Welcome';
import ApplyModel from './ApplyModel';
import ModelTraining from './ModelTraining';
import ImportData from './Tutorial/ImportData'
import OutputField from './Tutorial/OutputField';
import TypeOfProblem from './Tutorial/TypeOfProblem';
import TutorialModelTraining from './Tutorial/ModelTraining';
import TutorialAnalysis from './Tutorial/Analysis';
import TutorialApplyModel from './Tutorial/ApplyModel';
import Analysis from './Analysis';

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
            <Route path="/createmodel" component={CreateModel}></Route>
            <Route path="/applymodel" component={ApplyModel}></Route>
            <Route path="/modeltraining" component={ModelTraining}></Route>
            <Route path="/tutorial/outputfield" component={OutputField}></Route>
            <Route path="/tutorial/typeofproblem" component={TypeOfProblem}></Route>
            <Route path="/tutorial/importdata" component={ImportData}></Route>
            <Route path="/tutorial/modeltraining" component={TutorialModelTraining}></Route>
            <Route path="/tutorial/analysis" component={TutorialAnalysis}></Route>
            <Route path="/tutorial/applymodel" component={TutorialApplyModel}></Route>
            <Route path = "/Analysis" component={Analysis}></Route>
            <Route exact path='/' component={Welcome}></Route>
          </Switch>
        </BrowserRouter>
        {RenderPage}
      </AppContext.Provider>
    )
  }
}
