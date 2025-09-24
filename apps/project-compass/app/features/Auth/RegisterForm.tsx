import { Button, Form, Input } from '@project-compass/shared-ui';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from '../../store/store';
import { useAuth } from './useAuth';
export function RegisterForm() {
  const {
    name,
    email,
    password,
    confirmPassword,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleRegister,
  } = useAuth();

  const authStatus = useSelector((state: RootState) => state.auth.status);
  const navigate = useNavigate();
  return (
    <div className="flex w-[95%] h-screen items-center justify-center ">
      <Form
        onSubmit={handleRegister}
        formTitle="Rejestracja nowego użytkownika"
      >
        <Input
          name="Imię"
          type="common"
          placeHolder="Twoje imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired={true}
        />
        <Input
          name="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeHolder="e-mail"
          isRequired={true}
        />
        <Input
          isRequired={true}
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          placeHolder="********"
          type="password"
          value={password}
        />
        <Input
          name="Potwierdź hasło"
          isRequired={true}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          value={confirmPassword}
          placeHolder="********"
        />

        <div>
          <Button type="submit" variant="primary" className="w-full mt-5">
            {authStatus === 'loading' ? 'Rejestrowanie...' : 'Zarejestruj się'}
          </Button>
        </div>
        <div className="mt-4 text-center font-semibold text-white">
          Masz już konto?{' '}
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-5"
            onClick={() => navigate('/login')}
          >
            Zaloguj się
          </Button>
        </div>
      </Form>
    </div>
  );
}
