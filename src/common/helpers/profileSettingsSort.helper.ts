export const sortProfileSettingsChildren = (settings: ProfileSettings) => {
  settings.children?.sort((a, b) => {
    if (a.visible && !b.visible) {
      return -1;
    } else if (!a.visible && b.visible) {
      return 1;
    } else {
      return a.order - b.order;
    }
  });
};
