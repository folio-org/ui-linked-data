import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@/components/Loading';

import { MarcPreview } from '@/features/complexLookup/components/MarcPreview';
import { AuthoritiesResultList } from '@/features/search/ui';
import { Search } from '@/features/search/ui/components/Search';

interface AuthoritiesContentProps {
  isMarcPreviewOpen: boolean;
  isMarcLoading: boolean;
  handleAuthoritiesAssign: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
  handleTitleClick: (id: string) => void;
  handleCloseMarcPreview: VoidFunction;
  checkFailedId?: (id?: string) => boolean;
  hasComplexFlow?: boolean;
}

/**
 * AuthoritiesContent - Reusable content block for authorities lookup.
 * Handles authorities results list and MARC preview toggle.
 * Must be rendered inside a Search context.
 */
export const AuthoritiesContent: FC<AuthoritiesContentProps> = ({
  isMarcPreviewOpen,
  isMarcLoading,
  handleAuthoritiesAssign,
  handleTitleClick,
  handleCloseMarcPreview,
  checkFailedId,
  hasComplexFlow,
}) => {
  return (
    <>
      {!isMarcPreviewOpen && (
        <>
          <Search.ControlPane label={<FormattedMessage id="ld.marcAuthority" />} />
          <Search.ContentContainer>
            <Search.Results>
              <AuthoritiesResultList
                context="complexLookup"
                onAssign={handleAuthoritiesAssign}
                onTitleClick={handleTitleClick}
                checkFailedId={checkFailedId}
              />
              <Search.Results.Pagination />
            </Search.Results>
          </Search.ContentContainer>
        </>
      )}

      {isMarcPreviewOpen && (
        <>
          {isMarcLoading && <Loading />}
          {!isMarcLoading && (
            <MarcPreview
              onClose={handleCloseMarcPreview}
              onAssign={hasComplexFlow ? handleAuthoritiesAssign : undefined}
              checkFailedId={checkFailedId}
            />
          )}
        </>
      )}
    </>
  );
};
