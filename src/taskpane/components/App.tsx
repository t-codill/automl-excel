import * as React from 'react';
import { HeroListItem } from './HeroList';
import { AuthenticationService } from "../AuthenticationService";
import { SubscriptionService } from '../../automl/services/SubscriptionService'
import { SubscriptionModels } from "@azure/arm-subscriptions";
import { WorkSpaceService } from '../../automl/services/WorkSpaceService'
import { Router, Switch, Route, Link, Redirect, withRouter } from "react-router-dom";
import { createMemoryHistory } from 'history';
import { AzureMachineLearningWorkspacesModels } from '@azure/arm-machinelearningservices'
import { Pivot, PivotItem, IconButton } from 'office-ui-fabric-react';


//import Train from './Train'
import { /*IAppContextProps,*/ appContextDefaults, AppContext } from './AppContext';
//import Train from './Train';
import Test from './Test';

const memoryHistory = createMemoryHistory();

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  token: string;
  subscriptionList: SubscriptionModels.Subscription[];
  workspaceList: AzureMachineLearningWorkspacesModels.Workspace[];
}

export default class App extends React.Component<AppProps, AppState> {
  private appContext: any;

  async updateData(){
    await this.updateToken();
    console.log('awaiting subscription service');
    let subscriptionList = await new SubscriptionService(this.appContext).listSubscriptions();
    console.log('got list');
    this.setState({
      subscriptionList: subscriptionList
    });
    //await Promise.all(subscriptionList.map((subscription) => ))
    this.appContext.subscriptionId = subscriptionList[7].subscriptionId;
    let workspaceList = await new WorkSpaceService(this.appContext).listWorkspaces();
    console.log('shit did happen');
    this.setState({
      workspaceList: workspaceList
    });
    
  }

  constructor(props, context) {
    super(props, context);
    this.appContext = appContextDefaults;

    this.state = {
      listItems: [],
      token: "",
      subscriptionList: null,
      workspaceList: null,
    };
    
    this.appContext.getToken = function(){
      let token = this.state.token;
      console.log('getToken returned '.concat(token));
      return token;
    }.bind(this);

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

      let workspaceList;
      if(this.state.workspaceList === null){
        workspaceList = <p>Waiting for workspace list...</p>;
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

    let context = this.appContext;
    let RenderPage = renderPage.bind(this)({});

    let Navbar = withRouter((props) => {
      const data = {
        '/train': {
          title: 'Create and Train New Model',
          index: 0
        },
        '/test': {
          title: 'Use and Evaluate Existing Model',
          index: 1
        }
      }

      if(data.hasOwnProperty(props.location.pathname)){
        return (
          <div >
            <div style={{position: 'relative', height: 32, textAlign: 'center'}} className="ms-train__header_block">
              <Link style={{position: 'absolute'}} to="/"><IconButton style={{color: 'white', display: 'inline-block'}} iconProps={{ iconName: 'ChromeBack'}} title="back" ariaLabel="back"/></Link>
              <span className='ms-train__header'>{data[props.location.pathname].title}</span>
            </div>
            <Pivot defaultSelectedIndex={data[props.location.pathname].index} style={{textAlign: 'center'}}>
              <PivotItem headerText="Train Model">
                <Redirect to="/train"></Redirect>
              </PivotItem>
              <PivotItem headerText="Use Model">
                <Redirect to="/test"></Redirect>
              </PivotItem>
            </Pivot>
          </div>)
      }else{
        return <></>;
      }
    })

    return (
      <AppContext.Provider value={context}>
        
        <Router history={memoryHistory}>
          <Navbar />
          <Switch>
            <Route path="/train"><p>Train</p></Route>
            <Route path="/test"><Test /></Route>
            <Route exact path='/'><p>main page</p><Link to='/train'>Train</Link><Link to='/test'>Test</Link></Route>
          </Switch>
        </Router>
        {RenderPage}
      </AppContext.Provider>
    )
  }
}
