import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
