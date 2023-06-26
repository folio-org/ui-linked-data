import { Link } from 'react-router-dom';

export const Main = () => {
  return (
    <div>
      Welcome to the new Marva Editor. <Link to="/edit">Start editing.</Link>
    </div>
  );
};
