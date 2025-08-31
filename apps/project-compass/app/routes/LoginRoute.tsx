import { type LoaderFunction } from 'react-router';
import { LoginForm } from '../features/Auth/LoginForm';

export const loader: LoaderFunction = () => {
  return null;
};

export function Login() {
  return <LoginForm />;
}

export default Login;
