import 'office-ui-fabric-react/dist/css/fabric.min.css';

import App from './components/App';

import { AppContainer } from 'react-hot-loader';

import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import {BrowserRouter as Router, Route} from 'react-router-dom';
import ShowExistingModels from './components/ShowExistingModels';

initializeIcons();



let isOfficeInitialized = false;



const title = 'Contoso Task Pane Add-in';



const authenticationService = {

    async getToken(): Promise<string | undefined> {

        const response = await fetch("https://localhost:3001", {mode: 'cors'});

        const json = await response.json();

        return json.accessToken;

    }

};



const render = (Component) => {

    ReactDOM.render(
        <Router>
        <div>
        <Route exact path="/" component={App} />
            <Route path="/ShowExistingModels" component = {ShowExistingModels} />
        <AppContainer>

            <Component title={title} isOfficeInitialized={isOfficeInitialized} />

        </AppContainer>
        </div>
        </Router>,

        document.getElementById('container')

    );

};



/* Render application after Office initializes */

Office.initialize = async () => {

    isOfficeInitialized = true;

    render(App);

};



/* Initial render showing a progress bar */

render(App);



if ((module as any).hot) {

    (module as any).hot.accept('./components/App', () => {

        const NextApp = require('./components/App').default;

        render(NextApp);

    });

}



window.addEventListener('load', async () => {

    console.log('awaiting token')

    let token = await authenticationService.getToken();

    console.log('token = ' + token)

});