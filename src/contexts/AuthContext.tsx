import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import { authAPI } from '@/services/apiMock';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const defaultAuthContext: AuthContextData = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  login: async () => {
    throw new Error('AuthContext.login usado fora do AuthProvider');
  },
  logout: () => {
    throw new Error('AuthContext.logout usado fora do AuthProvider');
  }
};

const AuthContext = createContext<AuthContextData>(defaultAuthContext);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('@memirros:user');
      if (stored) setUser(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedUser = await authAPI.login(email, password);
      setUser(loggedUser);
      localStorage.setItem('@memirros:user', JSON.stringify(loggedUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@memirros:user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  // se login/logout ainda são as funções default → provider ausente
  if (context.login === defaultAuthContext.login) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}

