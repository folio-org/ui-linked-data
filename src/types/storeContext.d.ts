type StatusState = import('@src/store').StatusState;
type MarcPreviewState = import('@src/store').MarcPreviewState;

type StoreContext = {
  useStatusState: StatusState;
  useMarcPreviewState: MarcPreviewState;
};
