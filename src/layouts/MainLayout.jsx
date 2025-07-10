import { NavComponent } from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <NavComponent />
      </nav>
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
