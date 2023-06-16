export default function usePreviewTree(userValues: UserValue[] = []): PreviewMap {
  const tree: PreviewMap = new Map();

  userValues.forEach(elem => {
    const value = elem.value;
    const hasChildren = elem.hasChildren;
    const parsedPath = elem.field.split('_');
    const block = parsedPath[0].split(' ')[1];
    const group = parsedPath[1];
    const existingBlock = tree.get(block);

    if (hasChildren || !value.length) {
      return;
    }

    if (!existingBlock) {
      tree.set(block, {
        title: block,
        groups: new Map([
          [
            group,
            {
              title: group,
              value,
            },
          ],
        ]),
      });
    } else {
      const existingGroup = existingBlock.groups.get(group);

      if (!existingGroup) {
        existingBlock.groups.set(group, {
          title: group,
          value,
        });
      } else {
        const currentValue = existingGroup.value;

        existingGroup.value = [...currentValue, ...value];
      }
    }
  });

  return tree;
}
