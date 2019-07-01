import { ICommandBarItemProps, Icon, Link, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { PageNames } from "../common/PageNames";
import { BasePage } from "../components/Base/BasePage";
import { PageRedirect } from "../components/Redirect/PageRedirect";
import { StartRun } from "../startRun/StartRun";

import "./Welcome.scss";

export class Welcome extends BasePage<{}, { redirectToStartRun: boolean }, {}> {
    public static routePath = "Welcome";
    protected getData = undefined;
    protected header = "Welcome to Automated Machine Learning";
    protected pageName = PageNames.Welcome;
    protected readonly noBackButton = true;
    protected serviceConstructors = {};
    protected readonly navigationBarButtons: ICommandBarItemProps[] = [];

    public render(): React.ReactNode {
        if (this.state && this.state.redirectToStartRun) {
            return PageRedirect(StartRun, {});
        }
        return <>
            <section className="get-started ms-fontSize-m">
                <h3>Getting Started</h3>
                <p>Create your first experiment with automated machine learning to <br />
                    produce quality models with zero effort.</p>
                <p><PrimaryButton className="create-experiment-button" text="Create experiment" onClick={this.startNewRun} /></p>
            </section>
            <section className="whats-possible ms-fontSize-m">
                <h3>What's Possible with Automated Machine Learning</h3>
                <p>Automate the process of algorithm selection, hyperparameter tuning, and best model selection <br />
                    with automated machine learning, and accelerate your productivity. Select your data and let <br />
                    automated ML do the rest to provide the best model from endless possible options.</p>
            </section>
            <section className="view-documents ms-fontSize-m">
                <div><Icon className="document-icon" iconName="TextDocument" /></div>
                <h4>View Documentation</h4>
                <p>Learn what is automated machine learning and how to use it.</p>
                <p><Link href="https://aka.ms/automatedmluidocs" target="_blank">
                    Learn more about our feature and capabilities here <Icon iconName="NavigateExternalInline" />
                </Link></p>
            </section>
        </>;
    }

    private readonly startNewRun = () => {
        this.logUserAction("CreateExperiment");
        this.setState({
            redirectToStartRun: true
        });
    }
}
