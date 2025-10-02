import { FullScreenBaner } from '@project-compass/shared-ui';
import { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
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
    return (
      <FullScreenBaner>
        <p className="uppercase font-semibold text-gray-200">
          Sprawdzanie autoryzacji
        </p>
        <div className="w-full flex items-center  justify-center p-2">
          <p className="animate-spin  w-fit text-gray-200 text-xl">
            <AiOutlineLoading3Quarters />
          </p>
        </div>
      </FullScreenBaner>
    );
  }

  if (!isClient || !isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
