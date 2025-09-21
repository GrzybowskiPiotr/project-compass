import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { RootState } from '../store/store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const {
    isAuthenticated,
    isHydrated,
    status: authStatus,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isHydrated || authStatus === 'loading') {
    // authStatus === 'loading' jest tutaj opcjonalne, isHydrated wystarczy po starcie aplikacji
    // Możesz tutaj wyświetlić globalny spinner, aby nie było białego ekranu
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 text-white text-lg">
        Sprawdzanie autoryzacji...
      </div>
    );
  }

  // if (!isClient || !isHydrated) {
  //   return null;
  // }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
