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
const RESOURCE_URLS = [ROUTES.RESOURCE_EDIT.uri];

export const Nav = () => {
  const setLocale = useSetRecoilState(state.config.locale);
  const resourceRoutePattern = useRoutePathPattern(RESOURCE_URLS);

  return (
    <div data-testid="nav" className="nav">
      <div className="nav-block">
        <nav>
          {Object.values(ROUTES)
            .filter(({ name }) => !NOT_SHOWN.includes(name))
            .map(({ uri, name }) => (
              <NavLink to={uri} end key={uri}>
                <FormattedMessage id={name} />
              </NavLink>
            ))}
        </nav>
        {resourceRoutePattern && (
          <div className="nav-title">
            <FormattedMessage id={'marva.edit'} />
          </div>
        )}
      </div>
      <div className="nav-block">
        <RecordControls />
        <div className="nav-language-select">
          <select className="locale-select" onChange={({ target: { value } }) => setLocale(value)}>
            {Object.values(LOCALES).map(locale => (
              <option key={locale} value={locale}>
                {LOCALE_DISPLAY_NAMES[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
