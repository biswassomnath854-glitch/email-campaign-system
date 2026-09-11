import {
  createContext,
  useContext,
  useState
} from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    authService.getCurrentUser()
  );

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      authService.isAuthenticated()
    );

  const login = async (credentials) => {
    const response =
      await authService.login(credentials);

    const loggedInUser =
      authService.getCurrentUser();

    setUser(loggedInUser);
    setIsAuthenticated(true);

    return response;
  };

  const logout = async () => {
    await authService.logout();

    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshAccessToken = async () => {
    const token =
      await authService.refreshAccessToken();

    setIsAuthenticated(true);

    return token;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};