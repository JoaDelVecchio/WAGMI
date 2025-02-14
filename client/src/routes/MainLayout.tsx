import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return true ? (
    <div className="flex flex-col min-h-full">
      <header>
        <Navbar />
      </header>
      <main className="flex flex-grow justify-center items-center ">
        <Outlet />
      </main>
    </div>
  ) : (
    ""
  );
};

export default MainLayout;
