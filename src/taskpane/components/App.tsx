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


//const memoryHistory = createMemoryHistory();

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
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
      listItems: [],
      token: "",
      subscriptionList: null,
      workspaceList: null,
      appContext: appContext
    };
    
    this.updateData();
  }

  componentDidMount() {
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
          title: 'Create and Train New Model',
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
      <AppContext.Provider value={this.state.appContext}>
        
        <BrowserRouter basename="/taskpane">
          <Navbar />
          <Switch>
            <Route path="/train" component={Train}></Route>
            <Route path="/run" component={Run}></Route>
            <Route exact path='/' component={Welcome}></Route>
          </Switch>
        </BrowserRouter>
        {RenderPage}
      </AppContext.Provider>
    )
  }
}
