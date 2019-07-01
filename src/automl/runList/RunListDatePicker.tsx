
import { DatePicker, DayOfWeek, IDatePickerStrings } from "office-ui-fabric-react";
import * as React from "react";

interface IRunListDatePickerProps {
    onDateChange(
        startDate: Date | undefined,
        isDateRange: boolean
    ): void;
}

interface IRunListDatePickerState {
    datePickerSelect: Date | undefined;
    firstDayOfWeek: DayOfWeek.Sunday;
}

export const dayPickerStrings: IDatePickerStrings = {
    months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["S", "M", "T", "W", "T", "F", "S"],
    goToToday: "Go to today",
    prevMonthAriaLabel: "Go to previous month",
    nextMonthAriaLabel: "Go to next month",
    prevYearAriaLabel: "Go to previous year",
    nextYearAriaLabel: "Go to next year",
    closeButtonAriaLabel: "Close date picker"
};

export class RunListDatePicker extends React.Component<IRunListDatePickerProps, IRunListDatePickerState
    > {
    constructor(props: IRunListDatePickerProps) {
        super(props);
        this.state = {
            datePickerSelect: undefined,
            firstDayOfWeek: DayOfWeek.Sunday,
        };
    }
    public readonly render = (): React.ReactNode => {
        return (
            <DatePicker
                value={this.state.datePickerSelect}
                firstDayOfWeek={this.state.firstDayOfWeek}
                strings={dayPickerStrings}
                onSelectDate={this.handleDatePickerSelect}
                placeholder="Select a date..."
                ariaLabel="Select a date"
            />
        );
    }
    private readonly handleDatePickerSelect = (date: Date | null | undefined): void => {
        if (date) {
            this.setState({ datePickerSelect: date });
            this.props.onDateChange(date, false);
        }
        return;
    }
}
