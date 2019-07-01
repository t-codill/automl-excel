import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import * as React from "react";

import "./PageLoadingSpinner.scss";

const pageLoadingSpinner: React.FunctionComponent<{ label?: string }> = (props) => {
    return <Spinner className="page-loading-spinner" size={SpinnerSize.large} label={props.label || "Loading..."} />;
};

export { pageLoadingSpinner as PageLoadingSpinner };
