import { Button } from '@project-compass/shared-ui';
import { Form } from 'react-router';
import { useAuth } from './useAuth';
export function LoginForm() {
  const { email, password, setEmail, setPassword, handleSubmit } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-sm bg-blue-300 bg-opacity-50 p-8 rounded-lg shadow-xl mt-[-5%]">
        <h2 className="text-2xl text-center uppercase text-white font-bold mb-6">
          Zaloguj się
        </h2>
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-white font-bold" htmlFor="email-input">
                E-mail:
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email-input"
                type="email"
                name="email"
                value={email}
                required
                placeholder="e-mail"
                className="p-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white font-bold" htmlFor="password">
                Hasło:
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                name="password"
                value={password}
                required
                placeholder="********"
                className="p-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Button type="submit" variant="primary" className="w-full mt-5">
                Zaloguj się
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
