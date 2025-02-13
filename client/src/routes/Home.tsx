import { useAuthContext } from "../context/AuthContextProvider";

const Home = () => {
  const { currentUser } = useAuthContext();

  return <div>Home {currentUser?.username}</div>;
};

export default Home;
