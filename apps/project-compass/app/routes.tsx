import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  //Authentication routes
  route('login', './routes/LoginRoute.tsx'),
  route('signup', './routes/Signup.tsx'),

  //Protected route
  route('/', './routes/_protected.tsx', {}, [
    //Default route after user login
    index('./features/Projects/ProjectsList/ProjectsList.tsx'),
    //Route for creating new project
    route(
      'projects/new',
      './features/Projects/ProjectOperations/ProjectCreateForm.tsx',
    ),
    //Route for showing project details.
    route(
      'projects/:id',
      './features/Projects/ProjectOverview/ProjectDetailsPage.tsx',
    ),
  ]),
] satisfies RouteConfig;
