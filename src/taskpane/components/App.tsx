import * as React from 'react';
// import { ButtonType, PrimaryButton } from 'office-ui-fabric-react';
// import Header from './Header';
// import HeroList, { HeroListItem } from './HeroList';
import HeroList, {HeroListItem} from './HeroList';
 import Progress from './Progress';
import {Link, Switch, Route, Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import ShowExistingModels from './ShowExistingModels';
import Welcome from './Welcome';
import CreateNewModel from './CreateNewModel';

const memoryHistory = createMemoryHistory();

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  
}
// interface for changing state - 
export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: []
    };
  }

  componentDidMount() {
    this.setState({
      listItems: [
      ]
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
    //    range.format.fill.color = "green";
   
        await context.sync();
        console.log(`The range address was ${range.address}.`);
      });
    } catch (error) {
      console.error(error);
    }
  }

  



  render() {
    const {
      title,
      isOfficeInitialized,
    } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo='assets/logo-filled.png'
          message='Please sideload your addin to see app body.'
        />
      );
      
    }

   

    return (
      <Router history = {memoryHistory}>
    <Switch>
    {/* <Header logo='assets/azuremachinelearninglogo.png' title={this.props.title} message='Azure Machine Learning' /> */}
      <Route path = "/train"><p>train ux</p><Link to="/">Back</Link></Route>
      <Route path = "/test"><p>test ux</p><ShowExistingModels /><Link to="/">Back</Link></Route>
      <Route path = "/welcome"><p>welcome</p><Welcome /><Link to = "/CreateNewModel"><p>CreateNewModel</p></Link><Link to="/ShowExistingModels"><p>ShowExistingModels</p></Link></Route> 
      <Route path = "/CreateNewModel"><p>createnewmodel<CreateNewModel /></p><Link to="/">Back</Link></Route>
      <Route path = "/ShowExistingModels"><p>Show Existing Models</p><ShowExistingModels /><Link to="/">Back</Link></Route>
      <Route exact path = '/'><p>intro</p><Link to="/train">Back</Link><Link to='/test'>Test</Link><Link to ="/welcome">Welcome</Link><Link to ="/showexistingmodels">Show Existing Models</Link></Route>
      
      <HeroList message='' items={this.state.listItems}>
      </HeroList>
      </Switch>
    </Router>
  
    );
  }
  

 }
