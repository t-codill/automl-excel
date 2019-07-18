import * as React from "react";

export function updateState(component: React.Component, state: any){
    return new Promise((resolve, reject) => {
        component.setState(state, () => {
            resolve();
        });
    })
}