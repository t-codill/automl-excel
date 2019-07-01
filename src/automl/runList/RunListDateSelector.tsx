import { values } from "lodash";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";
import * as React from "react";

interface IRunListDateSelectorProps {
    onDateChange(
        startDate: Date | undefined
    ): void;
}

interface IRunListDateSelectorState {
    dateSelector: string | number | undefined;
    dropdownOptions: Array<{ key: string; text: string }>;
}

export const dateFilterDropdownOptions = {
    ALL: {
        key: "allDate",
        text: "All dates"
    },
    THIRTYDAYS: {
        key: "30days",
        text: "Last 30 days"
    },
    SIXTYDAYS: {
        key: "60days",
        text: "Last 60 days"
    },
    NINTYDAYS: {
        key: "90days",
        text: "Last 90 days"
    }
};

export class RunListDateSelector extends React.Component<IRunListDateSelectorProps, IRunListDateSelectorState
    > {
    constructor(props: IRunListDateSelectorProps) {
        super(props);
        const dropdownOptions = values(dateFilterDropdownOptions);
        this.state = {
            dateSelector: dateFilterDropdownOptions.ALL.key,
            dropdownOptions,
            // showDatePicker: false
        };
    }
    public readonly render = (): React.ReactNode => {
        return (
            <>
                <Dropdown
                    placeholder="All Dates"
                    onChange={this.changeState}
                    selectedKey={this.state.dateSelector}
                    options={this.state.dropdownOptions}
                />
            </>
        );
    }
    public changeState = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
        this.setState((prevState) => {
            if (option) {
                if (option.key !== this.state.dateSelector) {
                    let diff = 0;
                    switch (option.key) {
                        case dateFilterDropdownOptions.THIRTYDAYS.key:
                            diff = -30;
                            break;
                        case dateFilterDropdownOptions.SIXTYDAYS.key:
                            diff = -60;
                            break;
                        case dateFilterDropdownOptions.NINTYDAYS.key:
                            diff = -90;
                            break;
                        default:
                            diff = 0;
                    }
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() + diff);
                    this.props.onDateChange(diff === 0 ? undefined : startDate);
                    return { dateSelector: option.key };
                }
            }
            return { dateSelector: prevState.dateSelector };
        });
    }
}
