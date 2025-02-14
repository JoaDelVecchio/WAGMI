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
  refetchPortfolio: () => Promise<void>; // ✅ Add function to manually refetch
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

  // ✅ Fetch portfolio whenever `currentUser` changes
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

      if (!response.ok) {
        throw new Error("No portfolio found.");
      }
      const data = await response.json();
      setPortfolio(data.data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setError((error as Error).message || "Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio(); // 🔥 Fetch portfolio when `currentUser` updates
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        updateUser: setCurrentUser,
        error,
        loading,
        setPortfolio,
        portfolio,
        refetchPortfolio: fetchPortfolio, // ✅ Expose refetch function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
