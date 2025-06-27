export const initiateUserAgentDownload = (content: Blob, filename: string) => {
    const a = document.createElement('a');
    const link = window.URL.createObjectURL(content);
    a.href = link;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(link);
};