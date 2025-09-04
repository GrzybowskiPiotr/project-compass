import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../context/AuthContext';

export function useAuth() {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async function (event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirmPassword)
      console.error("password and confirm password did'n match ");

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (response.ok) {
      const newUser = await response.json();
      console.log(
        `Response from API: UserName: ${newUser.name} UserId: ${newUser.id}`,
      );
    }
  };

  const handleSubmit = async function (e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`Error while log in : ${errorData.message}`);
      return;
    }

    if (response.ok) {
      const { user, token } = await response.json();
      login(user, token);
      navigate('/');
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
    handleSubmit,
    handleRegister,
  };
}
