import * as React from "react";
import { generatePath, Redirect } from "react-router-dom";
import { IComponentWithRoute } from "../../common/IComponentWithRoute";
import { PageRedirectLinkRender } from "./PageRedirectLinkRender";
import { PageRedirectRender } from "./PageRedirectRender";
import { RedirectLink } from "./RedirectLink";

export type RouteProp<TRouteProp> = { [K in keyof TRouteProp]: string | number | boolean };

export function PageRedirectLink<TProp extends RouteProp<TProp>>(
    linkContent: React.ReactNode,
    component: IComponentWithRoute<TProp>,
    routeProps: Readonly<TProp>
): React.ReactNode {
    return <PageRedirectLinkRender expendedRoutePath={generatePath(component.routePath, routeProps)} >
        {linkContent}
    </PageRedirectLinkRender>;
}

export function PageRedirect<TProp extends RouteProp<TProp>>(
    component: IComponentWithRoute<TProp>,
    routeProps: Readonly<TProp>,
    /**
     * pass true for not pushing history.
     */
    noPush = false
): React.ReactNode {
    return <PageRedirectRender noPush={noPush || false} expendedRoutePath={generatePath(component.routePath, routeProps)} />;
}

export function BaseRedirectLink<TProp extends RouteProp<TProp>>(
    linkContent: React.ReactNode,
    component: IComponentWithRoute<TProp>,
    routeProps: Readonly<TProp>
): React.ReactNode {
    return (
        <RedirectLink to={`${generatePath(component.routePath, routeProps)}`}>
            {linkContent}
        </RedirectLink>
    );
}

export function BaseRedirect<TProp extends RouteProp<TProp>>(
    component: IComponentWithRoute<TProp>,
    routeProps: Readonly<TProp>,
    /**
     * Pass true for not pushing history.
     */
    noPush = false
): React.ReactNode {
    if (noPush) {
        return <Redirect to={`${generatePath(component.routePath, routeProps)}`} push={false} />;
    }
    else {
        return <Redirect to={`${generatePath(component.routePath, routeProps)}`} push={true} />;
    }
}
