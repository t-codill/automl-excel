export const saveAs = (content: Blob, fileName: string): void => {
    const evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    const link = window.document.createElement("a");
    link.setAttribute("href", window.URL.createObjectURL(content));
    link.setAttribute("download", fileName);
    link.dispatchEvent(evt);
};
