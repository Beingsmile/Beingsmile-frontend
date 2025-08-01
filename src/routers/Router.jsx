import {
  createBrowserRouter,
} from "react-router";
import Home from "../pages/Home.jsx";
import Dashboard from "../layouts/Dashboard.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import BrowseCampaigns from "../pages/BrowseCampaigns.jsx";
import StartCampaign from "../pages/StartCampaign.jsx";
import CampaignDetails from "../pages/CampaignDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "campaigns/browse",
        element: <BrowseCampaigns />
      },
      {
        path: "campaigns/create",
        element: <StartCampaign />
      },
      {
        path: "campaigns/:id",
        element: <CampaignDetails />
      },
    ]
  },
  {
    path: "/dashboard/",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <div>Dashboard Home</div>
      },
      {
        path: "profile",
        element: <div>Profile Page</div>
      },
      {
        path: "manage-campaigns",
        element: <div>Manage Campaigns</div>
      },
      {
        path: "manage-users",
        element: <div>Manage Users</div>
      },
      {
        path: "transactions",
        element: <div>Transactions</div>
      },
      {
        path: "reports",
        element: <div>Reports</div>
      },
      {
        path: "analytics",
        element: <div>Analytics</div>
      },
      {
        path: "verify-requests",
        element: <div>Verify Requests</div>
      }
    ]
  }
]);

export default router;