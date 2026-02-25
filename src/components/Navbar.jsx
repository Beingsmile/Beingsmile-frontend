import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import { useContext, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router";
import { FiHeart, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import profile from "../assets/user.png";

export function NavComponent({ setAuth }) {
  const { user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/campaigns/browse", label: "Browse" },
    { to: "/contact-us", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-100/50"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-primary rounded-lg group-hover:scale-110 transition-transform">
              <FiHeart className="text-white text-base" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 uppercase font-sans">
              Being<span className="text-primary">Smile</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-bold tracking-wide transition-all hover:text-primary ${isActive
                    ? "text-primary"
                    : "text-gray-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/campaigns/create"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all"
                >
                  <FaPlus size={10} />
                  Start Mission
                </Link>

                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <div className="p-0.5 rounded-lg border-2 border-primary/20 hover:border-primary transition-colors">
                      <Avatar
                        alt="User"
                        img={user.data?.avatar || user?.photoURL || profile}
                        rounded
                        size="sm"
                      />
                    </div>
                  }
                >
                  <DropdownHeader className="px-4 py-3">
                    <span className="block text-sm font-black text-gray-900 uppercase tracking-wider">
                      {user.data?.name || "Member"}
                    </span>
                    <span className="block text-xs font-bold text-primary mt-0.5">
                      {user.email}
                    </span>
                  </DropdownHeader>
                  <DropdownItem as={Link} to="/dashboard" className="px-4 py-2 font-bold text-sm">
                    <FiUser className="mr-2" /> My Profile
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onClick={handleLogout} className="px-4 py-2 font-bold text-sm text-red-500 hover:bg-red-50">
                    <FiLogOut className="mr-2" /> Log out
                  </DropdownItem>
                </Dropdown>
              </div>
            ) : (
              <button
                onClick={() => setAuth("login")}
                className="px-5 py-2 bg-primary text-white text-xs font-black rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest cursor-pointer"
              >
                Login
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <Link
                to="/campaigns/create"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg"
              >
                <FaPlus size={12} /> Start Mission
              </Link>
            )}
            {!user && (
              <button
                onClick={() => {
                  setAuth("login");
                  setIsMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
