import moment from "moment";

export function calculateDuration(startTime: Date | undefined, endTime: Date | undefined): string {
    if (!startTime || !endTime) {
        return "";
    }
    const start = moment(startTime);
    const end = moment(endTime);

    if (end.isBefore(start)) {
        return "";
    }

    const diff = end.diff(start);
    const duration = moment.duration(diff);
    const formatDigit = (digit: number) => {
        if (digit < 10) {
            return `0${digit}`;
        }
        return `${digit}`;
    };

    const hours = formatDigit(Math.floor(duration.asHours()));
    const minutes = formatDigit(duration.minutes());
    const seconds = formatDigit(duration.seconds());

    return `${hours}:${minutes}:${seconds}`;
}
