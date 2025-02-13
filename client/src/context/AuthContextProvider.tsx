import { createContext, useContext, useEffect, useState } from "react";

interface Portfolios {
  tokenId: string;
  amount: number;
}

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  portfolios: Portfolios[];
}

export interface AuthContextType {
  currentUser: IUser | undefined;
  updateUser: (user: IUser) => void;
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
  const [currentUser, setCurrentUser] = useState<IUser>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  console.log(currentUser);

  const updateUser = (user: IUser) => setCurrentUser(user);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
