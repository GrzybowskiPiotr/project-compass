import { Button } from '@project-compass/shared-ui';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import { logoutUserAndClearState } from './features/Auth/auth.slice';
import { AppDispatch, RootState } from './store/store';

export function AppNav() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleLogout = () => {
    dispatch(logoutUserAndClearState());
    navigate('/login');
  };

  return (
    <nav className="flex gap-4 p-4 bg-gray-800 text-white">
      <div className="flex justify-between w-full">
        <div className="flex gap-4">
          {isAuthenticated && (
            <NavLink
              to="/"
              className={
                'px-4 py-2 text-sm cursor-pointer rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus: ring-offset-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 '
              }
            >
              Projekty
            </NavLink>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            <span>
              {/* Do zrobienia wyświetlanie nazwy Usera po odświerzeniu strony lub po hydracji. */}
              {`Witaj, ${user?.name || 'Użytkowniku'}`}
              <Button variant="primary" onClick={handleLogout} className="ml-2">
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
