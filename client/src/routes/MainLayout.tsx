import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const currentUser = 1;
  return !currentUser ? (
    <Navigate to="profile/login" />
  ) : (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
