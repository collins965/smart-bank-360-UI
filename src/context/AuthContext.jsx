import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseURL = "http://localhost:8000";

  const [authTokens, setAuthTokens] = useState(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    return access && refresh ? { access, refresh } : null;
  });

  const [user, setUser] = useState(() => {
    try {
      return authTokens ? jwtDecode(authTokens.access) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!authTokens);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAuthTokens(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(`${baseURL}/api/token/refresh/`, {
        refresh: authTokens?.refresh,
      });
      const newAccess = response.data.access;

      const updatedTokens = {
        access: newAccess,
        refresh: authTokens.refresh,
      };

      localStorage.setItem("access", newAccess);
      setAuthTokens(updatedTokens);
      setUser(jwtDecode(newAccess));
      return newAccess;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logoutUser();
      return null;
    }
  }, [authTokens?.refresh, logoutUser]);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Axios interceptor for automatic token refresh
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(async (req) => {
      if (!authTokens) return req;

      const decoded = jwtDecode(authTokens.access);
      const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 5000;

      if (!isExpired) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
      }

      const newAccess = await refreshAccessToken();
      if (newAccess) {
        req.headers.Authorization = `Bearer ${newAccess}`;
      }

      return req;
    });

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [authTokens, refreshAccessToken]);

  const loginUser = async ({ username, password }) => {
    try {
      setError(null);

      const response = await axios.post(`${baseURL}/api/accounts/login/`, {
        username,
        password,
      });

      const { access, refresh } = response.data;
      const decodedUser = jwtDecode(access);

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      setAuthTokens({ access, refresh });
      setUser(decodedUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      const errMsg =
        err.response?.data?.detail || "Login failed. Please try again.";
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  useEffect(() => {
    if (authTokens) {
      try {
        const decoded = jwtDecode(authTokens.access);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch {
        logoutUser();
      }
    }
    setLoading(false);
  }, [authTokens, logoutUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        isAuthenticated,
        loginUser,
        logoutUser,
        setUser,
        setAuthTokens,
        setIsAuthenticated,
        axiosInstance,
        loading,
        error,
        setError,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
