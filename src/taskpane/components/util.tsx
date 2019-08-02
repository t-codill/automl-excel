import * as React from "react";

export function updateState<P, S>(component: React.Component<P, S>, state: Partial<S>){
    return new Promise((resolve, reject) => {
        component.setState(state as Pick<S, keyof S>, () => {
            resolve();
        });
    })
}