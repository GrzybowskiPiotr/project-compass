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
import { AuthProvider } from './context/AuthContext';

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="pl">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <AppNav />
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </AuthProvider>
  );
}

export default function App() {
  return <Outlet />;
}
