import { Button, Form, Input } from '@project-compass/shared-ui';

import { useAuth } from './useAuth';
export function LoginForm() {
  const { email, password, setEmail, setPassword, handleLogin } = useAuth();

  return (
    <div className="flex w-[95%] h-screen items-center justify-center mt-[-100px]">
      <Form onSubmit={handleLogin} formTitle="Zaloguj się">
        <Input
          name="E-mail"
          value={email}
          isRequired={true}
          onChange={(e) => setEmail(e.target.value)}
          placeHolder="Your email"
          type="email"
        />
        <Input
          type="password"
          name="Password"
          value={password}
          isRequired={true}
          onChange={(e) => setPassword(e.target.value)}
          placeHolder="********"
        />
        <div>
          <Button type="submit" variant="primary" className="w-full mt-5">
            Zaloguj się
          </Button>
        </div>
      </Form>
    </div>
  );
}
