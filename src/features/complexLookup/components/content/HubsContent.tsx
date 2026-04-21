import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@/components/Loading';

import { HubPreview } from '@/features/complexLookup/components/HubPreview';
import { HubPreviewProps } from '@/features/complexLookup/types/hubPreview.types';
import { HubsLookupResultList } from '@/features/search/ui';
import { Search } from '@/features/search/ui/components/Search';

/**
 * HubsContent - Reusable content block for hubs lookup.
 * Handles hubs results list with loading state during assignment and hub preview toggle.
 * Must be rendered inside a Search context.
 */
export const HubsContent: FC<Partial<HubPreviewProps>> = ({
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
          {isPreviewLoading ? (
            <Loading />
          ) : (
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
