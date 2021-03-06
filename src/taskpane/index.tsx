
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import { polyfill } from 'es6-promise';
import 'office-ui-fabric-react/dist/css/fabric.min.css';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';


polyfill();

initializeIcons();

let isOfficeInitialized = false;


const title = 'Contoso Task Pane Add-in';

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


if ((module as any).hot) {
    (module as any).hot.accept('./components/App', () => {
        const NextApp = require('./components/App').default;
        render(NextApp);
    });
}

console.log("Loaded page!");