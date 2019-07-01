import React from "react";
import { WorkspaceContext } from "../../common/context/WorkspaceContext";

export abstract class BaseComponentContext<TProp, TState> extends React.PureComponent<TProp, TState> {
    public static contextType = WorkspaceContext;
    public context!: React.ContextType<typeof WorkspaceContext>;
}
