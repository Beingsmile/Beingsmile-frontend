import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

const Dashboard = () => {
    return (
        <div>
            <ToastContainer />
            Dashboard
            <Outlet />
        </div>
    );
};

export default Dashboard;