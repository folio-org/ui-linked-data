export default function getTransformedPreviewComponents(userValues: UserValue[] = []): PreviewMap {
  const tree: PreviewMap = new Map();

  userValues.forEach(({ field, value, hasChildren }) => {
    const parsedPath = field.split('_');
    const block = parsedPath[0].split(' ')[1];
    const group = parsedPath[1];
    const uiControl = parsedPath[parsedPath.length - 1];
    const existingBlock = tree.get(block);

    if (hasChildren || !value.length) {
      return;
    }

    const updatedValue = value.map(elem => ({ ...elem, field: uiControl }));

    if (!existingBlock) {
      tree.set(block, {
        title: block,
        groups: new Map([
          [
            group,
            {
              title: group,
              value: updatedValue,
            },
          ],
        ]),
      });
    } else {
      const existingGroup = existingBlock.groups.get(group);

      if (!existingGroup) {
        existingBlock.groups.set(group, {
          title: group,
          value: updatedValue,
        });
      } else {
        existingGroup.value = [...existingGroup.value, ...updatedValue];
      }
    }
  });

  return tree;
}

const PREVIEW_BLOCKS_SORT_VALUES: PreviewBlockSortValues = {
  Work: 0,
  Instance: 1,
  Item: 2,
};

export const getSortedPreviewBlocks = (data: PreviewBlock[]) =>
  data.sort(
    ({ title: firstElemTitle }, { title: secondElemTitle }) =>
      PREVIEW_BLOCKS_SORT_VALUES[firstElemTitle] - PREVIEW_BLOCKS_SORT_VALUES[secondElemTitle],
  );
