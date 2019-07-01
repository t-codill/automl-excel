
export const download = (url: string, fileName: string): void => {
    const evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    const link = window.document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.dispatchEvent(evt);
};
