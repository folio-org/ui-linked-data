import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { ROUTES } from '@common/constants/routes.constants';
import { useRoutePathPattern } from '@common/hooks/useRoutePathPattern.hook';
import { LOCALES, LOCALE_DISPLAY_NAMES } from '@common/i18n/locales';
import { RecordControls } from '@components/RecordControls';
import state from '@state';
import './Nav.scss';

const NOT_SHOWN = [ROUTES.MAIN.name, ROUTES.RESOURCE_EDIT.name];

const RESOURCE_URLS = [ROUTES.RESOURCE_CREATE.uri, ROUTES.RESOURCE_EDIT.uri];

export const Nav = () => {
  const setLocale = useSetRecoilState(state.config.locale);
  const routePattern = useRoutePathPattern(RESOURCE_URLS);

  const navTitle = routePattern === ROUTES.RESOURCE_CREATE.uri ? 'marva.create' : 'marva.edit';

  return (
    <div data-testid="nav" className="nav">
      <nav>
        {Object.values(ROUTES)
          .filter(({ name }) => !NOT_SHOWN.includes(name))
          .map(({ uri, name }) => (
            <NavLink to={uri} end key={uri}>
              <FormattedMessage id={name} />
            </NavLink>
          ))}
      </nav>
      {routePattern && (
        <div className="nav-title">
          <FormattedMessage id={navTitle} />
        </div>
      )}
      <RecordControls />
      <select className="locale-select" onChange={({ target: { value } }) => setLocale(value)}>
        {Object.values(LOCALES).map(locale => (
          <option key={locale} value={locale}>
            {LOCALE_DISPLAY_NAMES[locale]}
          </option>
        ))}
      </select>
    </div>
  );
};
