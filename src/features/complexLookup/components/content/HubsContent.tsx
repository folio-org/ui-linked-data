import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@/components/Loading';

import { HubPreview } from '@/features/complexLookup/components/HubPreview';
import { HubsLookupResultList } from '@/features/search/ui';
import { Search } from '@/features/search/ui/components/Search';

interface HubResourceData {
  base: Schema;
  userValues: UserValues;
  initKey: string;
}

interface HubPreviewData {
  id: string;
  resource: HubResourceData;
}

interface HubsContentProps {
  isHubPreviewOpen?: boolean;
  isPreviewLoading?: boolean;
  isAssigning?: boolean;
  previewData?: HubPreviewData | null;
  previewMeta?: { id: string; title: string } | null;
  handleHubAssign?: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
  handleHubTitleClick?: (id: string, title?: string) => void;
  handleCloseHubPreview?: VoidFunction;
  handleHubPreviewAssign?: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
}

/**
 * HubsContent - Reusable content block for hubs lookup.
 * Handles hubs results list with loading state during assignment and hub preview toggle.
 * Must be rendered inside a Search context.
 */
export const HubsContent: FC<HubsContentProps> = ({
  isHubPreviewOpen = false,
  isPreviewLoading = false,
  isAssigning,
  previewData,
  previewMeta,
  handleHubAssign,
  handleHubTitleClick,
  handleCloseHubPreview,
  handleHubPreviewAssign,
}) => {
  return (
    <>
      {!isHubPreviewOpen && (
        <>
          <Search.ControlPane label={<FormattedMessage id="ld.hubs" />} showSubLabel={true} />
          <Search.ContentContainer>
            {isAssigning && <Loading />}

            {!isAssigning && (
              <Search.Results>
                <HubsLookupResultList
                  context="complexLookup"
                  onAssign={handleHubAssign}
                  onTitleClick={handleHubTitleClick}
                />
                <Search.Results.Pagination />
              </Search.Results>
            )}
          </Search.ContentContainer>
        </>
      )}

      {isHubPreviewOpen && (
        <>
          {isPreviewLoading && <Loading />}
          {!isPreviewLoading && (
            <HubPreview
              onClose={handleCloseHubPreview!}
              onAssign={handleHubPreviewAssign}
              previewData={previewData ?? null}
              previewMeta={previewMeta ?? null}
            />
          )}
        </>
      )}
    </>
  );
};
