import { FormattedMessage } from 'react-intl';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  RESOURCE_CREATE_URLS,
  RESOURCE_EDIT_CREATE_URLS,
  RESOURCE_URLS,
  ROUTES,
} from '@common/constants/routes.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { checkButtonDisabledState } from '@common/helpers/recordControls.helper';
import state from '@state';
import { Button, ButtonType } from '@components/Button';
import Times16 from '@src/assets/times-16.svg?react';
import { RESOURCE_TEMPLATE_IDS } from '@common/constants/bibframe.constants';
import './Nav.scss';
import { useBackToSearchUri } from '@common/hooks/useBackToSearchUri';

const NOT_SHOWN = [ROUTES.MAIN.name, ROUTES.RESOURCE_EDIT.name];

export const Nav = () => {
  const isEdited = useRecoilValue(state.status.recordIsEdited);
  const isInitiallyLoaded = useRecoilValue(state.status.recordIsInititallyLoaded);
  const resourceRoutePattern = useRoutePathPattern(RESOURCE_URLS);
  const isEditSectionOpen = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const isInCreateMode = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const isLoading = useRecoilValue(state.loadingState.isLoading);
  const currentlyEditedEntityBfid = useRecoilValue(state.ui.currentlyEditedEntityBfid);
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();

  return (
    <div data-testid="nav" className={DOM_ELEMENTS.classNames.nav}>
      {!isEditSectionOpen ? (
        <>
          <div className="nav-block">
            <nav>
              {Object.values(ROUTES)
                .filter(({ name }) => !NOT_SHOWN.includes(name))
                .map(({ uri, name }) =>
                  uri === ROUTES.RESOURCE_CREATE.uri &&
                  checkButtonDisabledState({ resourceRoutePattern, isInitiallyLoaded, isEdited }) ? (
                    <span key={uri} className="nav-link disabled">
                      <FormattedMessage id={name} />
                    </span>
                  ) : (
                    <NavLink to={uri} end key={uri} className="nav-link">
                      <FormattedMessage id={name} />
                    </NavLink>
                  ),
                )}
            </nav>
          </div>
        </>
      ) : (
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
          <span className="empty-block"></span>
        </div>
      )}
    </div>
  );
};
