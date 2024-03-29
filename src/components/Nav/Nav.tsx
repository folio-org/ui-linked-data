import { FormattedMessage } from 'react-intl';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  RESOURCE_CREATE_URLS,
  RESOURCE_EDIT_CREATE_URLS,
  RESOURCE_URLS,
  ROUTES,
} from '@common/constants/routes.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { LOCALES, LOCALE_DISPLAY_NAMES } from '@common/i18n/locales';
import { RecordControls } from '@components/RecordControls';
import { checkButtonDisabledState } from '@common/helpers/recordControls.helper';
import state from '@state';
import { LOCALE_SELECT_ENABLED } from '@common/constants/feature.constants';
import { Button, ButtonType } from '@components/Button';
import Times16 from '@src/assets/times-16.svg?react';
import { RESOURCE_TEMPLATE_IDS } from '@common/constants/bibframe.constants';
import './Nav.scss';

const NOT_SHOWN = [ROUTES.MAIN.name, ROUTES.RESOURCE_EDIT.name];

export const Nav = () => {
  const setLocale = useSetRecoilState(state.config.locale);
  const isEdited = useRecoilValue(state.status.recordIsEdited);
  const isInitiallyLoaded = useRecoilValue(state.status.recordIsInititallyLoaded);
  const resourceRoutePattern = useRoutePathPattern(RESOURCE_URLS);
  const isEditSectionOpen = useRoutePathPattern(RESOURCE_EDIT_CREATE_URLS);
  const isInCreateMode = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const isLoading = useRecoilValue(state.loadingState.isLoading);
  const currentlyEditedEntityBfid = useRecoilValue(state.ui.currentlyEditedEntityBfid);
  const navigate = useNavigate();

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
            {resourceRoutePattern && (
              <div className="nav-title">
                <FormattedMessage id="marva.editResource" />
              </div>
            )}
          </div>
          <div className="nav-block">
            <RecordControls />
            {LOCALE_SELECT_ENABLED && (
              <div className="nav-language-select">
                <select className="locale-select" onChange={({ target: { value } }) => setLocale(value)}>
                  {Object.values(LOCALES).map(locale => (
                    <option key={locale} value={locale}>
                      {LOCALE_DISPLAY_NAMES[locale]}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="nav-block nav-block-fixed-height">
          <nav>
            <Button type={ButtonType.Icon} onClick={() => navigate(ROUTES.MAIN.uri)} className="nav-close">
              <Times16 />
            </Button>
          </nav>
          <div className="heading">
            {!isLoading &&
              Array.from(currentlyEditedEntityBfid).map(bfid => (
                // TODO: include resource title once record processing refactoring is completed
                <FormattedMessage
                  key={bfid}
                  id={`marva.${isInCreateMode ? 'create' : 'edit'}${RESOURCE_TEMPLATE_IDS[bfid]}`}
                />
              ))}
          </div>
          <span className="empty-block"></span>
        </div>
      )}
    </div>
  );
};
