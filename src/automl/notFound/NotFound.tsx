import * as React from "react";

export class NotFound extends React.Component {
    public static routePath = "/";
    public readonly render = (): React.ReactNode => {
        return (<div>Not Found</div>);
    }
}
