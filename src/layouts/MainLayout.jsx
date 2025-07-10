import { NavComponent } from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
import { useState } from "react";
import Login from "../components/Login";

const MainLayout = () => {
    const [auth, setAuth] = useState("login");
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <NavComponent />
      </nav>
      <Outlet />
      {
        auth === "login" ? (
          <Login />
        ) : auth === "register" ? (
          <div className="fixed bottom-0 right-0 p-4 bg-green-500 text-white">
            Registration successful!
          </div>
        ) : auth === "forgotPass" ? (
          <div className="fixed bottom-0 right-0 p-4 bg-yellow-500 text-white">
            Password reset link is sent!
          </div>
        ) : null
      }
      <Footer />
    </>
  );
};

export default MainLayout;
