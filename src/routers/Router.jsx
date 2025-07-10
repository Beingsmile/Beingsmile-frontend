import {
  createBrowserRouter,
} from "react-router";
import Home from "../pages/Home.jsx";
import Dashboard from "../layouts/Dashboard.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      {
        path: "",
        element: <Home />
      }
    ]
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  }
]);

export default router;