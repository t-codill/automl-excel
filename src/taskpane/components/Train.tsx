import * as React from 'react';
import { Button, ButtonType } from 'office-ui-fabric-react';
import { HeroListItem } from './HeroList';
import { AuthenticationService } from "../AuthenticationService";

export interface AppProps {
  setPage: (page: string) => any;
}

export interface AppState {
  listItems: HeroListItem[];
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
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

  render() {


    return (
      <div className='ms-welcome'>
        <p>Training UI</p>
        <Button className='ms-welcome__action' buttonType={ButtonType.hero} iconProps={{ iconName: 'ChevronRight' }} onClick={() => this.props.setPage("use")}>go to use model</Button>

      </div>
    );
  }
}
