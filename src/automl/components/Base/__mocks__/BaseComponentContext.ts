import React from "react";
import { testContext } from "../../../common/context/__data__/testContext";
import { IWorkspaceContextProps } from "../../../common/context/IWorkspaceProps";
import { WorkspaceContext } from "../../../common/context/WorkspaceContext";

export abstract class BaseComponentContext<TProp, TState> extends React.Component<TProp, TState> {
    public static contextType = WorkspaceContext;
    public set context(_value: IWorkspaceContextProps) {
        return;
    }
    public get context(): React.ContextType<typeof WorkspaceContext> {
        return testContext;
    }
}
