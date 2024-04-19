import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { RESOURCE_CREATE_URLS } from '@common/constants/routes.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { Button, ButtonType } from '@components/Button';
import { RESOURCE_TEMPLATE_IDS } from '@common/constants/bibframe.constants';
import { useBackToSearchUri } from '@common/hooks/useBackToSearchUri';
import state from '@state';
import Times16 from '@src/assets/times-16.svg?react';
import './Nav.scss';

export const Nav = () => {
  const isInCreateMode = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const isLoading = useRecoilValue(state.loadingState.isLoading);
  const currentlyEditedEntityBfid = useRecoilValue(state.ui.currentlyEditedEntityBfid);
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();

  return (
    <div data-testid="nav" className={DOM_ELEMENTS.classNames.nav}>
      <div className="nav-block nav-block-fixed-height">
        <nav>
          <Button
            data-testid="nav-close-button"
            type={ButtonType.Icon}
            onClick={() => navigate(searchResultsUri)}
            className="nav-close"
          >
            <Times16 />
          </Button>
        </nav>
        <div className="heading">
          {!isLoading &&
            Array.from(currentlyEditedEntityBfid).map(bfid => (
              // TODO: include resource title once record processing refactoring is completed
              <FormattedMessage
                key={bfid}
                id={`marva.${isInCreateMode ? 'new' : 'edit'}${RESOURCE_TEMPLATE_IDS[bfid]}`}
              />
            ))}
        </div>
        <span className="empty-block" />
      </div>
    </div>
  );
};
