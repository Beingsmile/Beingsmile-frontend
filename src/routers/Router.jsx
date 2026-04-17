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
import AdminDashboard from "../layouts/AdminDashboard.jsx";
import AdminOverview from "../pages/admin/AdminOverview.jsx";
import CampaignReview from "../pages/admin/CampaignReview.jsx";
import AdminRoute from "./AdminRoute.jsx";
import Transactions from "../pages/admin/Transactions.jsx";
import UserManagement from "../pages/admin/UserManagement.jsx";
import VerificationReview from "../pages/admin/VerificationReview.jsx";
import PublicProfile from "../pages/PublicProfile.jsx";
import AccountStatus from "../pages/Dashboard/AccountStatus.jsx";
import VerificationStatus from "../pages/Dashboard/VerificationStatus.jsx";
import PayoutReview from "../pages/admin/PayoutReview.jsx";
import AdminPayoutLogs from "../pages/admin/AdminPayoutLogs.jsx";
import AdminCampaigns from "../pages/admin/AdminCampaigns.jsx";
import PendingUpdates from "../pages/admin/PendingUpdates.jsx";
import PlatformSettings from "../pages/admin/PlatformSettings.jsx";
import MyMissions from "../pages/Dashboard/MyMissions.jsx";
import SavedCampaigns from "../pages/Dashboard/SavedCampaigns.jsx";
import MissionSettings from "../pages/Dashboard/MissionSettings.jsx";
import Donations from "../pages/Dashboard/Donations.jsx";
import MyWallet from "../pages/Dashboard/MyWallet.jsx";

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
      {
        path: "p/:slug",
        element: <PublicProfile />,
      },
    ],
  },
  {
    path: "/dashboard",
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
        element: <MyMissions />,
      },
      {
        path: "saved-campaigns",
        element: <SavedCampaigns />,
      },
      {
        path: "mission-settings/:id",
        element: <MissionSettings />,
      },
      {
        path: "manage-users",
        element: <div>Manage Users</div>,
      },
      {
        path: "donations",
        element: <Donations />,
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
        path: "account-status",
        element: <AccountStatus />,
      },
      {
        path: "verification-status",
        element: <VerificationStatus />,
      },
      {
        path: "wallet",
        element: <MyWallet />,
      },
    ],
  },
  {
    path: "/admin/",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
    children: [
      {
        path: "",
        element: <AdminOverview />,
      },
      {
        path: "overview",
        element: <AdminOverview />,
      },
      {
        path: "review",
        element: <CampaignReview />,
      },
      {
        path: "campaigns",
        element: <AdminCampaigns />,
      },
      {
        path: "pending-updates",
        element: <PendingUpdates />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "verifications",
        element: <VerificationReview />,
      },
      {
        path: "payouts",
        element: <PayoutReview />,
      },
      {
        path: "payout-logs",
        element: <AdminPayoutLogs />,
      },
      {
        path: "settings",
        element: <PlatformSettings />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
    ],
  },
]);

export default router;
