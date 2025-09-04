import { User } from '@project-compass/shared-types';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AutchContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokecn: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AutchContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (userData: User, tocken: string) => {
    setUser(userData);
    setToken(tocken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };
  const value = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext mut be used within an AuthPtovider');
  }
  return context;
}
