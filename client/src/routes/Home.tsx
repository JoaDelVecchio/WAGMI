import { useAuthContext } from "../context/AuthContextProvider";
import { motion } from "framer-motion";
import Portfolio from "../components/Portfolio";
import HeroImage from "../assets/HeroImage.png";
const Home = () => {
  const { currentUser, loading, portfolio } = useAuthContext();
  if (loading) return <p className="text-center text-lg">Loading...</p>;

  if (currentUser && portfolio) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen p-4 pt-16">
        <Portfolio />
      </div>
    );
  }

  return (
    <div className="w-full  min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20 text-gray-900 px-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl hover:scale-105 duration-300 "
      >
        <h1 className="text-5xl font-extrabold leading-tight hover:scale-105 duration-300 ">
          Track Your{" "}
          <span className="text-blue-500 hover:scale-105 duration-300 ">
            Crypto
          </span>{" "}
          Portfolio in Real-Time
        </h1>
        <p className="text-lg hover:scale-105 duration-300  text-gray-600 mt-4">
          Stay ahead of the market with live prices, portfolio tracking, and
          analytics. Manage your Web3 investments **all in one place**.
        </p>
        <div className="hover:scale-105 duration-300 ">
          <motion.img
            src={HeroImage} // Empty for now
            alt="Crypto Portfolio"
            className="mt-6 mx-auto  "
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
