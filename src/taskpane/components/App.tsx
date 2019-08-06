//import { IconButton, Pivot, PivotItem, IPivotStyles } from 'office-ui-fabric-react';
import * as React from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { AppContext, AppContextState, appContextDefaults } from './AppContext';
import "office-ui-fabric-react/dist/css/fabric.css"
import Welcome from './Welcome';
import Login from './Login';
import TopContributors from './TopContributors';
import ModelAnalysis from './ModelAnalysis';
import Training from './Training';
import TutorialTrain1 from './TutorialTrain1';
import TutorialTrain2 from './TutorialTrain2';
import TutorialImportData from './TutorialImportData'
import TutorialTraining from './TutorialTraining';
import { Dialog } from './login/Dialog';
import { SubscriptionChooser } from './SubscriptionChooser';
import CreateModel from './CreateModel';
import ApplyModel from './ApplyModel';


class PrivateRoute extends Route{
  static contextType = AppContext;
  constructor(props){
    super(props);
    console.log("PrivateRoute constructor");
  }

  render(){

    let token = this.context.token;
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

  async updateContext(newContext: AppContextState){
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
    /*
    let Navbar = withRouter((props) => {
      const data = {
        '/train': {
          index: 0
        },
        '/run': {
          title: 'Use and Evaluate Existing Model',
          index: 1
        }
      }

      const pivotStyle: Partial<IPivotStyles> = {
        text: { color: 'white',
                fontSize: '13px'},
        root: { paddingLeft: '10px' },
        linkIsSelected: {height: '40px', selectors: {':before': {borderBottom: "2px solid " + 'rgb(256, 256, 256)'}}}
      };

      if(data.hasOwnProperty(props.location.pathname)){
        return (
          <div style={{position: 'relative', height: 40, textAlign: 'center'}} className="ms-train__header_block">
            <Link style={{position: 'absolute', left: 0}} to="/">
              <IconButton style={{color: 'white', display: 'inline-block', width: '30px', paddingTop: '12px'}} iconProps={{ iconName: 'ChromeBack'}} title="back" ariaLabel="back"/>
            </Link>
            <span>
              <Pivot style={{marginLeft: 50, marginRight: 50}} defaultSelectedIndex={data[props.location.pathname].index} styles={pivotStyle}>
                <PivotItem headerText="Create Model">
                  <Redirect to="/train"></Redirect>
                </PivotItem>
                <PivotItem headerText="Use Model">
                  <Redirect to="/run"></Redirect>
                </PivotItem>
              </Pivot>
            </span>
          </div>)
      }else{
        return <></>;
      }
    })
    */
    

    return (
      <AppContext.Provider value={this.state.appContext}>
        <BrowserRouter basename="/taskpane">
          <Switch>
            <PrivateRoute path="/createmodel" component={CreateModel}></PrivateRoute>
            <PrivateRoute exact path="/applymodel" component={ApplyModel}></PrivateRoute>
            <Route exact path='/' component={Welcome}></Route>
            <PrivateRoute path='/topcontributors' component={TopContributors}></PrivateRoute>
            <PrivateRoute path='/modelanalysis' component={ModelAnalysis}></PrivateRoute>
            <PrivateRoute path='/training' component={Training}></PrivateRoute>
            <Route path="/tutorialtrain1" component={TutorialTrain1}></Route>
            <Route path="/tutorialtrain2" component={TutorialTrain2}></Route>
            <Route path="/tutorialimportdata" component={TutorialImportData}></Route>
            <Route path="/tutorialtraining" component={TutorialTraining}></Route>
            <Route path="/logindialog" component={Dialog}></Route>
            <PrivateRoute path="/subscription_chooser" component={SubscriptionChooser}></PrivateRoute>
          </Switch>
        </BrowserRouter>
      </AppContext.Provider>
    )
  }
}
