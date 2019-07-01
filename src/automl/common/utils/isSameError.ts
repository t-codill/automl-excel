import { WorkspaceError } from "../context/IWorkspaceProps";

export function isSameError(error: WorkspaceError, other: WorkspaceError): boolean {
    if (error.statusCode !== other.statusCode) {
        return false;
    }
    if (!error.message && !other.message) {
        return true;
    }
    if (!error.message || !other.message) {
        return false;
    }
    return error.message.split(/(\r|\n)/)[0] === other.message.split(/(\r|\n)/)[0];
}
