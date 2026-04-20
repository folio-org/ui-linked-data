export const initiateUserAgentDownload = (content: Blob, filename: string) => {
  const a = document.createElement('a');
  const link = globalThis.URL.createObjectURL(content);
  a.href = link;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  globalThis.URL.revokeObjectURL(link);
};
