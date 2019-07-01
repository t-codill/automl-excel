import { ITheme } from "office-ui-fabric-react";

export const getThemeNeutralPrimary = (props?: { theme?: ITheme }) => {
    if (props && props.theme) {
        return props.theme.palette.neutralPrimary;
    }

    return undefined;
};
