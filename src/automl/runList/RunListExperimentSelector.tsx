
import { map } from "lodash";
import { Dropdown, DropdownMenuItemType, IDropdownOption, Toggle } from "office-ui-fabric-react";
import * as React from "react";

import "./RunListExperimentSelector.scss";

interface IExperimentSelectorOption {
    key: string;
    text: string;
}

interface IRunListExperimentSelectorProps {
    experimentNames: string[] | undefined;
    isAllSelect: boolean;
    onExperimentChange(
        experiments: string[] | undefined
    ): void;
}

interface IRunListExperimentSelectorState {
    availableOptions: IExperimentSelectorOption[];
    experimentSelectedItems?: string[];
    isAllSelect: boolean;
    experimentNames: string[];
}

export class RunListExperimentSelector extends React.Component<IRunListExperimentSelectorProps, IRunListExperimentSelectorState
    > {
    constructor(props: IRunListExperimentSelectorProps) {
        super(props);
        const availableOptions = this.getOptions(this.props.experimentNames);
        const experimentNames = map(availableOptions.slice(2), (option) => option.key);
        this.state = {
            availableOptions,
            experimentSelectedItems: experimentNames,
            isAllSelect: this.props.isAllSelect,
            experimentNames
        };
    }
    public readonly render = (): React.ReactNode => {
        return (
            <>
                <Dropdown
                    calloutProps={{
                        className: "experiment-selector-callout"
                    }}
                    selectedKeys={this.state.experimentSelectedItems}
                    multiSelect={true}
                    onChange={this.changeState}
                    placeholder="Select Experiments"
                    options={this.state.availableOptions}
                    onRenderOption={this.onRenderOption}
                    onRenderTitle={this.onRenderTitle}
                />
            </>
        );
    }
    private readonly onRenderTitle = () => {
        if (this.state.experimentSelectedItems && this.state.experimentSelectedItems.length === this.state.experimentNames.length) {
            return <span>All Experiments</span>;
        } else if (this.state.experimentSelectedItems && this.state.experimentSelectedItems.length === 1) {
            return <span>{this.state.experimentSelectedItems[0]}</span>;
        } else {
            return <span>{this.state.experimentSelectedItems && this.state.experimentSelectedItems.length} Experiments</span>;
        }
    }

    private readonly changeState = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
        if (option) {
            this.setState((preState) => {
                const updatedSelectedItem = preState && preState.experimentSelectedItems ? [...preState.experimentSelectedItems] : [];
                if (option.selected) {
                    // add the option if it's checked
                    updatedSelectedItem.push(option.key.toString());
                } else {
                    // remove the option if it's unchecked
                    const currIndex = updatedSelectedItem.indexOf(option.key.toString());
                    updatedSelectedItem.splice(currIndex, 1);
                }
                this.props.onExperimentChange(updatedSelectedItem);
                return {
                    experimentSelectedItems: updatedSelectedItem,
                    isAllSelect: updatedSelectedItem.length === preState.experimentNames.length
                };
            });
        }
    }

    private readonly onToggleChanged = (_event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean | undefined) => {
        this.setState((preState) => {
            const updatedSelectedItem = checked ? preState.experimentNames : [];
            this.props.onExperimentChange(updatedSelectedItem);
            return {
                isAllSelect: !preState.isAllSelect,
                experimentSelectedItems: updatedSelectedItem
            };
        });
    }

    private readonly getOptions = (experimentNames: string[] | undefined) => {
        if (!experimentNames) {
            return [];
        }
        return [
            {
                key: "allOption",
                text: "Select All",
                itemType: DropdownMenuItemType.Header
            },
            {
                key: "divider",
                text: "-",
                itemType: DropdownMenuItemType.Divider
            },
            ...experimentNames.map((experimentName) => {
                return {
                    key: experimentName,
                    text: experimentName
                };
            })];
    }

    private readonly onRenderOption = (option?: IDropdownOption, defaultRender?: (props?: IDropdownOption) => JSX.Element | null) => {
        if (!option) {
            return <></>;
        }
        if (option.index === 0) {
            return (
                <Toggle
                    checked={this.state.isAllSelect}
                    inlineLabel={true}
                    label="Select All Experiment"
                    onChange={this.onToggleChanged} />
            );
        }
        if (defaultRender) {
            return defaultRender(option);
        }
        return <></>;
    }
}
