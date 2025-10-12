import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
  type MetaFunction,
} from 'react-router';
import stylesHref from '../styles.css?url';
import { AppNav } from './app-nav';
import { checkAuth } from './features/Auth/auth.slice';
import { clearProjectError } from './features/Projects/Projects/projects.slice';
import store, { AppDispatch, RootState } from './store/store';

export const meta: MetaFunction = () => [
  {
    title: 'Project Compass App',
  },
];

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: stylesHref },
];

function AuthHydrationWrapper({ children }: { children: React.ReactNode }) {
  const dispatch: AppDispatch = useDispatch();
  const { isHydrated, status: authStatus } = useSelector(
    (state: RootState) => state.auth,
  );
  useEffect(() => {
    if (typeof window !== 'undefined' && !isHydrated) {
      dispatch(checkAuth());
      dispatch(clearProjectError());
    }
  }, [dispatch, isHydrated]);

  if (!isHydrated && authStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 text-white text-lg">
        Ładowanie autentykacji...
      </div>
    );
  }

  return <>{children}</>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          src="https://kit.fontawesome.com/95c5ab3364.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <Provider store={store}>
          <AuthHydrationWrapper>
            <AppNav />
            <div className="min-h-screen min-w-full bg-gradient-to-b from-gray-600 to-gray-800 flex flex-col items-start p-4">
              {children}
            </div>
          </AuthHydrationWrapper>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
