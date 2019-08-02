import { AzureMachineLearningWorkspacesModels } from '@azure/arm-machinelearningservices';
import { SubscriptionModels } from "@azure/arm-subscriptions";
import * as React from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";\
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
import { Dialog } from './login/Dialog';
import { SubscriptionChooser } from './SubscriptionChooser';
import Login from './Login';


class PrivateRoute extends Route{
  static contextType = AppContext;
  constructor(props){
    super(props);
    console.log("PrivateRoute constructor");
  }

  render(){

    let token = this.context.getToken();
    if(token === null || token === ""){
      return <Login></Login>
    }

    if(this.context.subscriptionId === null){
      return <SubscriptionChooser></SubscriptionChooser>;
    }
    
    return super.render();
  }
}

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  appContext: IAppContextProps;
}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props, context) {
    super(props, context);
    console.log("App constructor");

    let appContext = appContextDefaults;
    appContext.update = this.updateContext.bind(this);

    this.state = {
      appContext: appContext
    };
    
  }

  async updateContext(newContext: IAppContextProps){
    await this.updateState({
      appContext: Object.assign(this.state.appContext, newContext)
    })
    return this.state.appContext;
  }

  async updateState(newState){
    return new Promise((resolve, reject) => {
      this.setState(newState, () => resolve());
    });
  }

  render(){
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
            <Route path="/logindialog" component={Dialog}></Route>
            <PrivateRoute path="/subscription_chooser" component={SubscriptionChooser}></PrivateRoute>
          </Switch>
        </BrowserRouter>
      </AppContext.Provider>
    )
  }
}
