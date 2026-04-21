export interface HubResourceData {
  base: Schema;
  userValues: UserValues;
  initKey: string;
}

export interface HubPreviewData {
  id: string;
  resource: HubResourceData;
}

export interface HubPreviewMeta {
  id: string;
  title: string;
}

export interface HubPreviewStateProps {
  isHubPreviewOpen: boolean;
  isPreviewLoading: boolean;
  previewData: HubPreviewData | null;
  previewMeta: HubPreviewMeta | null;
}

export interface HubPreviewHandlerProps {
  handleHubTitleClick: (id: string, title?: string) => void;
  handleCloseHubPreview: VoidFunction;
  handleHubPreviewAssign: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
}

export interface HubPreviewProps extends HubPreviewStateProps, HubPreviewHandlerProps {
  handleHubAssign?: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
  isAssigning?: boolean;
}
