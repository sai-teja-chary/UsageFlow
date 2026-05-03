import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getUser, loginUser, logoutUser, registerUser } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    setUserLoading(true);

    try {
      const res = await getUser();
      setUser(res.data);
    } catch (error) {
      setUser(null); // only here ❗
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setInitialized(true);
    };
    init();
  }, [fetchUser]);

  const register = async (email, password) => {
    try {
      setAuthLoading(true);
      await registerUser(email, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      await loginUser(email, password);
      await fetchUser();
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      fetchUser,
      userLoading,
      initialized,
      authLoading,
      setAuthLoading,
      login,
      register,

      logout,
    }),
    [user, userLoading, authLoading, initialized, fetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
