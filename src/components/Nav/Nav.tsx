import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { RESOURCE_URLS, ROUTES } from '@common/constants/routes.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern';
import { LOCALES, LOCALE_DISPLAY_NAMES } from '@common/i18n/locales';
import { RecordControls } from '@components/RecordControls';
import { checkButtonDisabledState } from '@common/helpers/recordControls.helper';
import state from '@state';
import './Nav.scss';
import { LOCALE_SELECT_ENABLED } from '@common/constants/feature.constants';

const NOT_SHOWN = [ROUTES.MAIN.name, ROUTES.RESOURCE_EDIT.name];

export const Nav = () => {
  const setLocale = useSetRecoilState(state.config.locale);
  const isEdited = useRecoilValue(state.status.recordIsEdited);
  const isInitiallyLoaded = useRecoilValue(state.status.recordIsInititallyLoaded);
  const resourceRoutePattern = useRoutePathPattern(RESOURCE_URLS);

  return (
    <div data-testid="nav" className={DOM_ELEMENTS.classNames.nav}>
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
    </div>
  );
};
