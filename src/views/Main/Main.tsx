import { Link } from 'react-router-dom';

export const Main = () => {
  return (
    <div data-testid='main'>
      Welcome to the new Marva Editor. <Link to="/edit">Start editing.</Link>
    </div>
  );
};
