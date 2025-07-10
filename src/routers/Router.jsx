import {
  createBrowserRouter,
} from "react-router";
import Home from "../pages/Home.jsx";
import Dashboard from "../layouts/Dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, 
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  }
]);

export default router;