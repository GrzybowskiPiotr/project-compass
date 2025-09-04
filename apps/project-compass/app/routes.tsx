import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route('login', './routes/LoginRoute.tsx'),
  route('signup', './routes/Signup.tsx'),
  route('/', './routes/_protected.tsx', {}, [
    index('./features/ProjectView/ProjectView.tsx'),
  ]),
] satisfies RouteConfig;
