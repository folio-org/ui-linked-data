import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { ROUTES } from '@common/constants/routes.constants';
import { LOCALES, LOCALE_DISPLAY_NAMES } from '@common/i18n/locales';
import { RecordControls } from '@components/RecordControls';
import state from '@state';
import './Nav.scss';

const NOT_SHOWN = [ROUTES.MAIN.name, ROUTES.RESOURCE_EDIT.name];

export const Nav = () => {
  const setLocale = useSetRecoilState(state.config.locale);

  return (
    <div data-testid="nav" className="nav">
      <div className="main-title">marva::next</div>
      <nav>
        {Object.values(ROUTES)
          .filter(({ name }) => !NOT_SHOWN.includes(name))
          .map(({ uri, name }) => (
            <NavLink to={uri} end key={uri}>
              <FormattedMessage id={name} />
            </NavLink>
          ))}
      </nav>
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
