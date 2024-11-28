type StatusState = import('@src/store').StatusState;
type MarcPreviewState = import('@src/store').MarcPreviewState;

type StoreContext = {
  useStatusStore: StatusState;
  useMarcPreviewStore: MarcPreviewState;
};
