import { useState } from 'react';

export function useAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      const data = await response.json();
      console.log('Login successful:', data);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  };
}
