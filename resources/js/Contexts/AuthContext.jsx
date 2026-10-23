import { createContext, useContext, useReducer, useCallback } from 'react';
import { demoAccounts } from '../data/demoData';

const AuthContext = createContext();

const STORAGE_KEY = 'glamor_auth';

function loadAuth() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

function authReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'LOGIN':
      newState = { user: action.payload, isAuthenticated: true };
      break;
    case 'LOGOUT':
      newState = { user: null, isAuthenticated: false };
      break;
    default:
      return state;
  }
  try {
    if (newState.isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch { /* silently fail */ }
  return newState;
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, null, loadAuth);

  const login = useCallback((username, password) => {
    const account = demoAccounts.find(
      a => a.username === username && a.password === password
    );
    if (account) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: account.username,
          name: account.name,
          role: account.role,
          professionalId: account.professionalId || null
        }
      });
      return { success: true, user: account };
    }
    return { success: false, error: 'Identifiants incorrects' };
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const hasPermission = useCallback((module) => {
    if (!state.user) return false;
    const { role } = state.user;
    if (role === 'admin') return true;

    const managerModules = ['dashboard', 'appointments', 'services', 'products', 'orders', 'payments', 'clients', 'staff'];
    if (role === 'manager') return managerModules.includes(module);

    const employeeModules = ['dashboard', 'appointments'];
    if (role === 'employee') return employeeModules.includes(module);

    return false;
  }, [state.user]);

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
