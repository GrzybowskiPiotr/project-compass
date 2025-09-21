import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { type AppDispatch, RootState } from '../../store/store';
import { loginUser, registerUser } from './auth.slice';

export function useAuth() {
  const dispatch: AppDispatch = useDispatch();

  const { isAuthenticated, status, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async function (event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirmPassword) {
      console.error("password and confirm password did'n match ");
      // Do zrobienia - Tutaj możesz ustawić lokalny stan błędu, aby wyświetlić komunikat w UI
      return;
    }
    const resultAction = await dispatch(
      registerUser({ name, email, password }),
    );
    if (registerUser.fulfilled.match(resultAction)) {
      console.log('Rejetracja pomyślna, przekierowywanie...');
      navigate('/');
    } else {
      console.error('Rejestracja nieudana: ', resultAction.payload as string);
    }
  };

  const handleLogin = async function (e: React.FormEvent) {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      console.log('Logowanie pomyślne, przekierowywanie...');
      navigate('/', { replace: true });
    } else {
      console.error(
        'Logowanie nieudane:',
        (resultAction.payload as string) || 'Nieznany błąd',
      );
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    confirmPassword,
    setConfirmPassword,
    handleLogin,
    handleRegister,
    isAuthenticated,
    status,
    error,
  };
}
