import { ROUTES } from '@common/constants/routes.constants';
import { Link } from 'react-router-dom';
import './Nav.scss';

const NOT_SHOWN = [ROUTES.MAIN.name];

export const Nav = () => {
  return (
    <div data-testid="nav" className="nav">
      <div className="main-title">marva::next</div>
      {Object.values(ROUTES)
        .filter(({ name }) => !NOT_SHOWN.includes(name))
        .map(({ uri, name }) => (
          <Link to={uri} key={uri}>
            {name}
          </Link>
        ))}
    </div>
  );
};
