export const formatRecordsListData = (content: ResourceListItem[]) =>
  content?.map(({ id, label }: { id: string; label: string }) => ({
    title: {
      label,
    },
    id: {
      label: id,
    },
    __meta: {
      id,
    },
  }));
