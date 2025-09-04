import { Button } from '@project-compass/shared-ui';
import { NavLink, useNavigate } from 'react-router';
import { useAuthContext } from './context/AuthContext';

export function AppNav() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  return (
    <nav className="flex gap-4 p-4 bg-gray-800 text-white">
      <div className="flex justify-between w-full">
        <div className="flex gap-4">
          <NavLink to="/" end>
            Home
          </NavLink>
        </div>
        <div>
          {user ? (
            <span>
              {`Witaj, ${user.name}`}
              <Button variant="primary" onClick={logout} className="ml-2">
                Wyloguj
              </Button>
            </span>
          ) : (
            <span className="flex gap-2 items-center">
              <Button variant="primary" onClick={() => navigate('/login')}>
                Zaloguj
              </Button>
              lub
              <Button variant="primary" onClick={() => navigate('/signup')}>
                Zarejestruj się
              </Button>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
