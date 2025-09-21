import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Opcjonalnie: Response interceptor - obsługa błędów autoryzacji (np. 401)
// Możesz dodać ten fragment później, gdy będziemy testować wylogowanie
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     // Jeśli błąd to 401 Unauthorized i to nie jest endpoint logowania/rejestracji
//     // i nie próbowaliśmy jeszcze odświeżyć tokenu (lub w naszym przypadku po prostu wylogować)
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Zapobiega nieskończonej pętli
//       // Tutaj można by odświeżać token, ale na razie po prostu wylogowujemy
//       // import { store } from '../store/store';
//       // store.dispatch(logout()); // Zrobić dispatch logout
//       // window.location.href = '/login'; // Przekierować na stronę logowania
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
