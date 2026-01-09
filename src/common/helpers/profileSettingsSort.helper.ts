export const sortProfileSettingsChildren = (settings: ProfileSettings) => {
  settings.children?.sort((a, b) => {
    if (a.visible && !b.visible) {
      return -1;
    } else if (!a.visible && b.visible) {
      return 1;
    } else if (!a.visible && !b.visible) {
      return 0;
    } else if (a.order !== undefined && b.order === undefined) {
      // .order shouldn't be undefined if both are visible,
      // but handle those cases anyways.
      return -1;
    } else if (a.order === undefined && b.order !== undefined) {
      return 1;
    } else if (a.order === undefined && b.order === undefined) {
      return 0;
    } else {
      return a.order! - b.order!;
    }
  });
};
