import * as React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { IComponentWithRoute } from "../../common/IComponentWithRoute";
import { Main } from "../../Main";
export function PageRoute<TProps>(
    component: IComponentWithRoute<TProps>): React.ReactNode {
    const renderChild = (prop: RouteComponentProps<TProps>): React.ReactNode => {
        return React.createElement(component, { ...prop.match.params });
    };
    return <Route exact={true} path={`${Main.routePath}/${component.routePath}`} render={renderChild} />;
}

export function BaseRoute<TNoneRouteProp, TProps extends TNoneRouteProp>(component: IComponentWithRoute<TProps>): React.ReactNode {
    const renderChild = (prop: RouteComponentProps<Exclude<TProps, TNoneRouteProp>>): React.ReactNode => {
        return React.createElement(component, { ...prop.match.params });
    };
    return <Route exact={true} path={`${component.routePath}`} render={renderChild} />;
}

export function DefaultRoute<TNoneRouteProp, TProps extends TNoneRouteProp>(component: IComponentWithRoute<TProps>): React.ReactNode {
    const renderChild = (prop: RouteComponentProps<Exclude<TProps, TNoneRouteProp>>): React.ReactNode => {
        return React.createElement(component, { ...prop.match.params });
    };
    return <Route exact={false} path={`${component.routePath}`} render={renderChild} />;
}
