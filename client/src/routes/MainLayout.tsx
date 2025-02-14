import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const currentUser = 1;
  return !currentUser ? (
    <Navigate to="profile/login" />
  ) : (
    <div className="flex flex-col min-h-full">
      <header>
        <Navbar />
      </header>
      <main className="flex flex-grow justify-center items-center pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
