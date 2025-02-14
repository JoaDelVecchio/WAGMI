import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

interface IUser {
  _id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  currentUser: IUser | undefined;
  updateUser: (user: IUser | undefined) => void;
  fetchUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext is not available");
  return authContext;
};

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

  // ✅ Function to fetch the authenticated user
  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // ✅ Ensure cookies are sent
      });

      if (!response.ok) throw new Error("Not authenticated");

      const data = await response.json();
      setCurrentUser(data.user);
    } catch (error) {
      setCurrentUser(undefined);
    }
  };

  // ✅ Call fetchUser on app start
  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = (user: IUser | undefined) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
