import * as React from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { AppContext, AppContextState, appContextDefaults } from './AppContext';
import "office-ui-fabric-react/dist/css/fabric.css"
import CreateModel from './CreateModel';
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
import { IFunction, ICustomFunctionsMetadata } from 'custom-functions-metadata';


class PrivateRoute extends Route{
  static contextType = AppContext;
  constructor(props){
    super(props);
    console.log("PrivateRoute constructor");
  }

  render(){

    let token = this.context.token;
    console.log(token)
    if(token === null || token === ""){
      return <Login></Login>
    }
    if (!this.context.settingCompleted) {
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
  appContext: AppContextState;
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

  async componentDidMount(){

    //@ts-ignore
    let code =
    "/* @customfunction \n" +
    " * @param a First number \n" +
    " * @returns the square of the number \n" +
    " */\n"
    "function automl(a){ return a*a; }";
    console.log("trying function")

    let functionMetadata: IFunction = {
      description: "automl",
      helpUrl: "https://microsoft.com",
      id: "automl",
      name: "automl",
      parameters: [
        {
          name: "a",
          dimensionality: "scalar",
          description: "",
          type: "any",
          optional: false,
          repeating: false
        }
      ],
      result: {
        type: "any",
        dimensionality: "scalar"
      },
      options: {
        cancelable: false,
        requiresAddress: false,
        stream: false,
        volatile: false
      }
    }
    //@ts-ignore
    let functionsMetadata: ICustomFunctionsMetadata = {
      functions: [
        functionMetadata
      ]
    }
    try{

    if (Office.context.requirements.isSetSupported('CustomFunctions', 1.6)) {
      //await (Excel as any).CustomFunctionManager.register(JSON.stringify(functionsMetadata), code);
    }
    }catch(err){
      console.log("error doing function")
      console.log(err);
    }
    console.log("Did function!")
  }

  async updateContext(newContext: AppContextState){
    for(var key in newContext){
      this.state.appContext[key] = newContext[key];
    }

    await this.updateState({
      appContext: this.state.appContext
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
            <PrivateRoute path="/createmodel" component={CreateModel}></PrivateRoute>
            <PrivateRoute path="/applymodel" component={ApplyModel}></PrivateRoute>
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
