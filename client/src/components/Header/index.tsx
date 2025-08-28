import { Link } from 'react-router-dom';
import { type MouseEvent} from 'react';
import Auth from '../../utils/auth';

const Header = () => {
  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className="bg-primary text-light mb-4 py-3 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div>
          <Link className="text-light" to="/">
            <h1 className="m-0">3868 Pass Down</h1>
          </Link>
          <Link className="container flex-row justify-space-between-lg justify-center align-center" to={'/shiftlog'}>
            <h2>Shift Log</h2>
            </Link>
          <p className="m-0">Shift Pass Down</p>
        </div>
        <div>
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-lg btn-info m-2" to="/">
                {Auth.getProfile().data.email}'s Items
              </Link>
              <button className="btn btn-lg btn-light m-2" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-lg btn-info m-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-lg btn-light m-2" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
      {Auth.loggedIn() && (
        <div className="container">
          <span className="badge bg-success me-2">
            Current Shift: {new Date().toLocaleDateString()}
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;