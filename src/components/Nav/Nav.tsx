import { Link } from 'react-router-dom';
import './Nav.scss';

export const Nav = () => {
  return (
    <div className="nav">
      <div className="main-title">Marva Next</div>
      <Link to="/load">Load</Link>
      <Link to="/edit">Edit</Link>
      <Link to="#">Options</Link>
    </div>
  );
};
