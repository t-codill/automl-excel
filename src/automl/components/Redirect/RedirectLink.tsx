import { Link } from "office-ui-fabric-react";
import * as React from "react";
import { Redirect } from "react-router-dom";

export class RedirectLink extends React.Component<{ to: string }, { clicked: boolean }> {
    protected serviceConstructors = {};
    protected getData = undefined;
    public render(): React.ReactNode {
        if (this.state && this.state.clicked) {
            return <Redirect to={this.props.to} push={true} />;
        }
        return <Link onClick={this.click}>{this.props.children}</Link>;
    }

    private readonly click = () => {
        this.setState({ clicked: true });
    }
}
