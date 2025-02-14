import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { IPortfolio } from "../types";
import { API_BASE_URL } from "../config";

// Define the user type
type User = {
  id: string;
  username: string;
  email: string;
};

export const AuthContext = createContext<{
  currentUser: User | undefined;
  updateUser: (updatedUser: User | undefined) => void;
  loading: boolean;
  error: string | null;
  portfolio: IPortfolio | undefined;
  setPortfolio: React.Dispatch<React.SetStateAction<IPortfolio | undefined>>;
  fetchPortfolio: () => Promise<void>;
} | null>(null);

export const useAuthContext = () => {
  const authcontext = useContext(AuthContext);
  if (!authcontext) throw new Error("Main must be wrapped with context");
  return authcontext;
};

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return undefined;

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return undefined;
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<IPortfolio | undefined>(undefined);

  // ✅ Fetch portfolio function to use globally
  const fetchPortfolio = async () => {
    if (!currentUser) return;

    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("No portfolio found.");

      const data = await response.json();
      setPortfolio(data.data);
    } catch (error) {
      setError((error as Error).message || "Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Automatically fetch portfolio on login
  useEffect(() => {
    fetchPortfolio();
  }, [currentUser]);

  useEffect(() => {
    if (portfolio) {
      console.log("Portfolio updated:", portfolio);
    }
  }, [portfolio]);

  const updateUser = (updatedUser: User | undefined) => {
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        updateUser,
        error,
        loading,
        setPortfolio,
        portfolio,
        fetchPortfolio, // ✅ Now available globally
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
