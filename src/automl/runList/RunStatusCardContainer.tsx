import { Dictionary } from "lodash";
import { FocusZone } from "office-ui-fabric-react";
import * as React from "react";
import { RunStatusCard } from "./RunStatusCard";

const mergedStatus: string[] = ["Running", "Completed", "Failed", "Others"];

interface IRunStatusCardContainerProps {
    runStatus: Dictionary<number>;
    onStatusFilterChange(
        statusFilter: string | undefined
    ): void;
}
interface IRunStatusCardContainerState {
    selectedCard: string | undefined;
}
export class RunStatusCardContainer extends React.Component<IRunStatusCardContainerProps, IRunStatusCardContainerState>{
    constructor(props: IRunStatusCardContainerProps) {
        super(props);
        this.state = {
            selectedCard: undefined
        };
    }
    public readonly render = (): React.ReactNode => {
        return (
            <FocusZone className="ms-Grid">
                {mergedStatus.map((s) =>
                    <RunStatusCard key={s}
                        className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ms-xl6 ms-xxl6 ms-xxxl6"
                        isActive={this.state.selectedCard === s}
                        handleStatusFilterChange={this.handleStatusCardClick}
                        runStatusLabel={s}
                        runStatusCount={this.props.runStatus[s] || 0} />
                )}
            </FocusZone>
        );
    }
    private readonly handleStatusCardClick = (selectedCard: string | undefined) => {
        this.setState({ selectedCard });
        this.props.onStatusFilterChange(selectedCard);
    }
}
