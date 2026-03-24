export const getFilenameWithoutExtension = (filename: string) => {
  const extensionIndex = filename.lastIndexOf('.');
  if (extensionIndex > 0) {
    return filename.substring(0, extensionIndex);
  }
  return filename;
};

export const getUrlFilenameWithoutExtension = (url: string) => {
  let filename;
  try {
    const parsed = new URL(url);
    // pathname is always at least '/'; if otherwise empty, use hostname
    if (parsed.pathname.length === 1) {
      filename = parsed.hostname;
    } else {
      const segments = parsed.pathname.split('/');
      const fileSegment = segments.findLast(member => member.length > 0);
      // for the corner case where the pathname is nothing but repeated '/'
      if (fileSegment === undefined) {
        filename = parsed.hostname;
      } else {
        filename = getFilenameWithoutExtension(fileSegment);
      }
    }
  } catch {
    // argument cannot be parsed as a URL, pass it through with some sanitizing
    filename = url.replace(/[^A-z0-9_-]/g, '-');
  }
  return filename;
};
