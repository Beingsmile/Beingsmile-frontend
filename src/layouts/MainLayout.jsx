import { NavComponent } from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

const MainLayout = () => {
    const [auth, setAuth] = useState("login");
    
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <NavComponent setAuth={setAuth} />
      </nav>
      <Outlet />
      {
        auth === "login" ? (
          <Login setAuth={setAuth} />
        ) : auth === "register" ? (
          <Register setAuth={setAuth} />
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
