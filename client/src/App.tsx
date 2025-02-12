import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./routes/MainLayout";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/profile",
      children: [
        { path: "login", element: <Login /> },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
