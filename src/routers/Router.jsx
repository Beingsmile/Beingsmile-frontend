import { createBrowserRouter } from "react-router";
import Home from "../pages/Home.jsx";
import Dashboard from "../layouts/Dashboard.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import BrowseCampaigns from "../pages/BrowseCampaigns.jsx";
import StartCampaign from "../pages/StartCampaign.jsx";
import CampaignDetails from "../pages/CampaignDetails.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import ContactUs from "../pages/ContactUs.jsx";
import Profile from "../pages/Profile.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import PaymentFailure from "../pages/PaymentFailure.jsx";
import PaymentCancelled from "../pages/PaymentCancelled.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import ForgotPass from "../components/ForgotPass.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "campaigns/browse",
        element: <BrowseCampaigns />,
      },
      {
        path: "campaigns/create",
        element: (
          <PrivateRoute>
            <StartCampaign />
          </PrivateRoute>
        ),
      },
      {
        path: "campaigns/:id",
        element: <CampaignDetails />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-failure",
        element: <PaymentFailure />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled />,
      },
      {
        path: "forgot-password",
        element: <ForgotPass />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/dashboard/",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <Profile />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "manage-campaigns",
        element: <div>Manage Campaigns</div>,
      },
      {
        path: "manage-users",
        element: <div>Manage Users</div>,
      },
      {
        path: "transactions",
        element: <div>Transactions</div>,
      },
      {
        path: "reports",
        element: <div>Reports</div>,
      },
      {
        path: "analytics",
        element: <div>Analytics</div>,
      },
      {
        path: "verify-requests",
        element: <div>Verify Requests</div>,
      },
    ],
  },
]);

export default router;
