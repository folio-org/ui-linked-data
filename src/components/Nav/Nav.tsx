import { ROUTES } from '@common/constants/routes.constants';
import { LOCALES, LOCALE_DISPLAY_NAMES } from '@common/i18n/locales';
import state from '@state';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import './Nav.scss';

const NOT_SHOWN = [ROUTES.MAIN.name];

export const Nav = () => {
  const setLocale = useSetRecoilState(state.config.locale);

  return (
    <div data-testid="nav" className="nav">
      <div className="main-title">marva::next</div>
      {Object.values(ROUTES)
        .filter(({ name }) => !NOT_SHOWN.includes(name))
        .map(({ uri, name }) => (
          <Link to={uri} key={uri}>
            <FormattedMessage id={name} />
          </Link>
        ))}
      <select className='locale-select' onChange={({ target: { value } }) => setLocale(value)}>
        {Object.values(LOCALES).map(locale => (
          <option key={locale} value={locale}>
            {LOCALE_DISPLAY_NAMES[locale]}
          </option>
        ))}
      </select>
    </div>
  );
};
