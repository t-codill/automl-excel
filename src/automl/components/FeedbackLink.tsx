import { Icon, Link } from "office-ui-fabric-react";
import * as React from "react";

export class FeedbackLink extends React.Component {
    public render(): React.ReactNode {
        return (
            <Link style={{
                fontSize: 12,
                position: "fixed",
                right: 20,
                top: 30
            }}
                target="_blank"
                href={"https://social.msdn.microsoft.com/Forums/en-US/newthread?category=undefined&forum=AzureMachineLearningService&Subject=[Automated%20ML][UI]"}>
                <Icon iconName="Feedback" style={{ marginRight: 5 }} />
                <span className="ms-hiddenMdDown">We'd love to get your feedback!</span>
            </Link>);
    }
}
