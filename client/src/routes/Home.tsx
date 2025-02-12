import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";

const Home = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext is not available");

  const { currentUser } = authContext;

  return <div>Home {currentUser?.username}</div>;
};

export default Home;
