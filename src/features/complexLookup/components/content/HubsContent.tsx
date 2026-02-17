import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@/components/Loading';

import { HubsLookupResultList } from '@/features/search/ui';
import { Search } from '@/features/search/ui/components/Search';

interface HubsContentProps {
  isAssigning: boolean;
  handleHubAssign: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
}

/**
 * HubsContent - Reusable content block for hubs lookup.
 * Handles hubs results list with loading state during assignment.
 * Must be rendered inside a Search context.
 */
export const HubsContent: FC<HubsContentProps> = ({ isAssigning, handleHubAssign }) => {
  return (
    <>
      <Search.ControlPane label={<FormattedMessage id="ld.hubs" />} showSubLabel={true} />
      <Search.ContentContainer>
        {isAssigning && <Loading />}

        {!isAssigning && (
          <Search.Results>
            <HubsLookupResultList context="complexLookup" onAssign={handleHubAssign} />
            <Search.Results.Pagination />
          </Search.Results>
        )}
      </Search.ContentContainer>
    </>
  );
};
