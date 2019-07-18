import { AzureMachineLearningWorkspacesModels } from '@azure/arm-machinelearningservices';
import { SubscriptionModels } from "@azure/arm-subscriptions";
//import { createMemoryHistory } from 'history';
import { IconButton, Pivot, PivotItem, IPivotStyles } from 'office-ui-fabric-react';
import * as React from 'react';
import { Link, Redirect, Route, Switch, withRouter, BrowserRouter } from "react-router-dom";
import { SubscriptionService } from '../../automl/services/SubscriptionService';
import { WorkSpaceService } from '../../automl/services/WorkSpaceService';
import { AuthenticationService } from "../AuthenticationService";
import { AppContext, IAppContextProps, appContextDefaults } from './AppContext';
import { HeroListItem } from './HeroList';
//import Test from './Test';
import "office-ui-fabric-react/dist/css/fabric.css"
import Train from './Train';
import Welcome from './Welcome';
import Run from './Run';
import Login from './Login';
import AuthHandler from './AuthHandler';
import TopContributors from './TopContributors';
import ModelAnalysis from './ModelAnalysis';
import Training from './Training';
import TutorialTrain1 from './TutorialTrain1';
import TutorialTrain2 from './TutorialTrain2';
import TutorialImportData from './TutorialImportData'
import TutorialTraining from './TutorialTraining';
import { DialogOpen } from './login/Dialog';

//const memoryHistory = createMemoryHistory();

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  token: string;
  appContext: IAppContextProps;
}

export default class App extends React.Component<AppProps, AppState> {
  async componentDidMount(){
    /*
    await this.updateState({
      token: await AuthenticationService.getToken()
    });*/
    //await this.updateWorkspaceList();
    this.setState({
      listItems: [
        {
          icon: 'Ribbon',
          primaryText: 'Achieve more with Office integration'
        },
        {
          icon: 'Unlock',
          primaryText: 'Unlock features and functionality'
        },
        {
          icon: 'Design',
          primaryText: 'Create and visualize like a pro'
        }
      ]
    });
  }
  async updateState(newState){
    return new Promise((resolve, reject) => {
      this.setState(newState, () => resolve());
    });
  }
  async updateSubscriptionList(){
    let subscriptionList = await new SubscriptionService(this.state.appContext.serviceBaseProps).listSubscriptions();
    await this.updateState({
      appContext: {
        ...this.state.appContext,
        subscriptionList: subscriptionList
      }
    });
  }
  async updateWorkspaceList(){
    await this.updateSubscriptionList();

    let newWorkspaceList: AzureMachineLearningWorkspacesModels.Workspace[] = [];
    console.log(this.state.appContext.subscriptionList);

    for(var i = 0; i < this.state.appContext.subscriptionList.length; i++){
      let subscription = this.state.appContext.subscriptionList[i];
      let subscriptionId = subscription.subscriptionId;
      let serviceBaseProps = {
        ...this.state.appContext.serviceBaseProps,
        subscriptionId: subscriptionId
      }
      let toPush = await new WorkSpaceService(serviceBaseProps).listWorkspaces();
      toPush.forEach(item => newWorkspaceList.push(item));
    }

    await this.updateState({
      appContext: {
        ...this.state.appContext,
        workspaceList: newWorkspaceList
      }
    });

    console.log('New workspace list:')
    console.log(this.state.appContext.workspaceList);
  }

  constructor(props, context) {
    super(props, context);

    let appContext = appContextDefaults;
    
    appContext.serviceBaseProps.getToken = function(){
      return this.state.token;
    }.bind(this);

    appContext.setToken = function(token: string){
      this.setState({
        token: token
      });
    }.bind(this);

    appContext.updateSubscriptionList = this.updateSubscriptionList.bind(this);
    appContext.updateWorkspaceList = this.updateWorkspaceList.bind(this);

    this.state = {
      listItems: [],
      token: "",
      appContext: appContext
    };
    
  }


  updateToken = async () => {
    this.setState({
      token: await AuthenticationService.getToken()
    });
  }

  click = async () => {
    try {
      await Excel.run(async context => {
        /**
         * Insert your Excel code here
         */
        const range = context.workbook.getSelectedRange();

        // Read the range address
        range.load("address");

        // Update the fill color
        range.format.fill.color = "yellow";

        await context.sync();
        console.log(`The range address was ${range.address}.`);
      });
    } catch (error) {
      console.error(error);
    }
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
    return (
      <AppContext.Provider value={{...this.state.appContext}}>
        
        <BrowserRouter basename="/taskpane">
          <Navbar />
          <Switch>
            <Route path="/train" component={Train}></Route>
            <Route exact path="/run" component={Run}></Route>
            <Route exact path='/' component={Welcome}></Route>
            <Route path='/login' component={Login}></Route>
            <Route path='/auth' component={AuthHandler}></Route>
            <Route path='/topcontributors' component={TopContributors}></Route>
            <Route path='/modelanalysis' component={ModelAnalysis}></Route>
            <Route path='/training' component={Training}></Route>
            <Route path="/tutorialtrain1" component={TutorialTrain1}></Route>
            <Route path="/tutorialtrain2" component={TutorialTrain2}></Route>
            <Route path="/tutorialimportdata" component={TutorialImportData}></Route>
            <Route path="/tutorialtraining" component={TutorialTraining}></Route>
            <Route path="/dialogopen" component={DialogOpen}></Route>
          </Switch>
        </BrowserRouter>
        {RenderPage}
      </AppContext.Provider>
    )
  }
}
