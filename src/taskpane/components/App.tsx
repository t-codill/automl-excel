import * as React from 'react';
import { Button, ButtonType } from 'office-ui-fabric-react';
import { HeroListItem } from './HeroList';
import { AuthenticationService } from "../AuthenticationService";
import Train from './Train'

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  currentPage: string;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      listItems: [],
      currentPage: "use"
    };
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

  getToken = async () => {
    console.log('getting token!');
    let token = await AuthenticationService.getToken();
    console.log('token = ' + token)
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

  setPage(page: string){
    console.log('setting page to ' + page);
    this.setState({
      currentPage: page
    });
  }

  render() {

    if(this.state.currentPage == "train"){
      return (<Train setPage={this.setPage.bind(this)} />)
    }else if(this.state.currentPage == "use"){
      return (
        <div>
          <p>Use model</p>
          <Button className='ms-welcome__action' buttonType={ButtonType.hero} iconProps={{ iconName: 'ChevronRight' }} onClick={() => this.setPage("train")}>back to train</Button>
        </div>
      )
    }else{
      return (<p>Invalid page {this.state.currentPage}</p>)
    }
    /*

    return (
      <div className='ms-welcome'>
        <Header logo='assets/logo-filled.png' title={this.props.title} message='Welcome' />
        <HeroList message='Discover what Office Add-ins can do for you today!' items={this.state.listItems}>
          <p className='ms-font-l'>Modify the source files, then click <b>Run</b>.</p>
          <Button className='ms-welcome__action' buttonType={ButtonType.hero} iconProps={{ iconName: 'ChevronRight' }} onClick={this.click}>Run</Button>
          <Button className='ms-welcome__action' buttonType={ButtonType.hero} iconProps={{ iconName: 'ChevronRight' }} onClick={this.getToken}>Get Token</Button>
        </HeroList>
      </div>
    );
    */
  }
}
