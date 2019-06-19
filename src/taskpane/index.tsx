import 'office-ui-fabric-react/dist/css/fabric.min.css';
import App from './components/App';
import { AppContainer } from 'react-hot-loader';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

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
        <AppContainer>
            <Component title={title} isOfficeInitialized={isOfficeInitialized} />
        </AppContainer>,
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