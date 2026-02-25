import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import { useContext, useState, useEffect } from "react";
import { FaMoon, FaSun, FaPlus } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { useTheme } from "../hooks/useTheme";
import { Link, NavLink } from "react-router";
import { FiHeart, FiUser, FiLogOut, FiSettings, FiMenu, FiX } from "react-icons/fi";
import profile from "../assets/user.png";

export function NavComponent({ setAuth }) {
  const { theme, toggleTheme } = useTheme();
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
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <FiHeart className="text-white text-xl" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase font-sans">
              Being<span className="text-primary">Smile</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-bold tracking-wide transition-all hover:text-primary ${isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-gray-600 dark:text-gray-300"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-primary transition-colors border border-gray-100 dark:border-gray-700"
            >
              {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/campaigns/create"
                  className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <FaPlus size={12} />
                  Start Fundraising
                </Link>

                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <div className="p-0.5 rounded-xl border-2 border-primary/20 hover:border-primary transition-colors">
                      <Avatar
                        alt="User"
                        img={user.data?.avatar || user?.photoURL || profile}
                        rounded
                        size="md"
                      />
                    </div>
                  }
                >
                  <DropdownHeader className="px-5 py-4">
                    <span className="block text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      {user.data?.name || "Member"}
                    </span>
                    <span className="block text-xs font-bold text-primary mt-0.5">
                      {user.email}
                    </span>
                  </DropdownHeader>
                  <DropdownItem as={Link} to="/dashboard" className="px-5 py-3 font-bold text-sm">
                    <FiUser className="mr-2" /> My Profile
                  </DropdownItem>
                  <DropdownItem as={Link} to="/dashboard/settings" className="px-5 py-3 font-bold text-sm text-gray-500">
                    <FiSettings className="mr-2" /> Settings
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onClick={handleLogout} className="px-5 py-3 font-bold text-sm text-red-500 hover:bg-red-50">
                    <FiLogOut className="mr-2" /> Log out
                  </DropdownItem>
                </Dropdown>
              </div>
            ) : (
              <button
                onClick={() => setAuth("login")}
                className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Login
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <Link
                to="/campaigns/create"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-xl"
              >
                <FaPlus size={14} /> Start Fundraising
              </Link>
            )}
            {!user && (
              <button
                onClick={() => {
                  setAuth("login");
                  setIsMenuOpen(false);
                }}
                className="w-full text-center px-4 py-3 bg-primary text-white font-bold rounded-xl"
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
