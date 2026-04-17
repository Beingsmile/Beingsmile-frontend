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
import { FiHeart, FiUser, FiLogOut, FiMenu, FiX, FiBookmark } from "react-icons/fi";
import profile from "../assets/user.png";
import NotificationBell from "./NotificationBell";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export function NavComponent({ setAuth }) {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
    { to: "/", label: t("nav.home") },
    { to: "/campaigns/browse", label: t("nav.browse") },
    { to: "/contact-us", label: t("nav.contact") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled
        ? "bg-white shadow-sm border-b border-gray-100"
        : "bg-white border-b border-gray-100"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[60px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
              <FiHeart className="text-white" size={14} />
            </div>
            <span className="text-lg font-black tracking-tight text-gray-900">
              Being<span className="text-[#2D6A4F]">Smile</span>
            </span>
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors hover:text-[#2D6A4F] ${isActive ? "text-[#2D6A4F]" : "text-gray-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/campaigns/create"
                  className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-[#2D6A4F] text-white text-xs font-bold rounded-lg hover:bg-[#1B4332] transition-colors"
                >
                  <FaPlus size={9} />
                  {t("nav.start_mission")}
                </Link>

                <NotificationBell />

                <Link
                  to="/dashboard/saved-campaigns"
                  className="p-2 text-gray-400 hover:text-[#2D6A4F] relative group transition-colors"
                  title="Saved Missions"
                >
                  <FiBookmark size={18} />
                </Link>

                <Dropdown
                  arrowIcon={false}
                  inline
                  theme={{
                    floating: {
                      base: "z-10 w-fit rounded-xl shadow-xl border border-gray-100 bg-white backdrop-blur-md focus:outline-none",
                      content: "rounded-xl py-1 px-1",
                      header: "px-4 py-3 border-b border-gray-100/50 mb-1",
                      style: {
                        dark: "bg-white text-gray-900 border-gray-100",
                        light: "bg-white text-gray-900 border-gray-100",
                        auto: "bg-white text-gray-900 border-gray-100"
                      },
                      item: {
                        base: "flex w-full cursor-pointer items-center justify-start px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors focus:outline-none",
                        icon: "mr-3 h-4 w-4 text-gray-400 group-hover:text-emerald-600"
                      }
                    }
                  }}
                  label={
                    <div className="w-9 h-9 rounded-xl border-2 border-primary hover:border-primary transition-all p-0 overflow-hidden bg-white shadow-sm flex items-center justify-center">
                      <img
                        alt="User Profile"
                        src={user.data?.avatar || user?.photoURL || profile}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  }
                >
                  <DropdownHeader>
                    <div className="flex flex-col">
                      <span className="block text-sm font-black text-gray-900 tracking-tight">
                        {user.data?.name || "Member"}
                      </span>
                      <span className="block text-[11px] font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {user.email}
                      </span>
                    </div>
                  </DropdownHeader>
                  <DropdownItem as={Link} to="/dashboard">
                    <FiUser className="mr-2" /> {t("nav.profile")}
                  </DropdownItem>
                  <DropdownItem as={Link} to="/dashboard/donations">
                    <FiHeart className="mr-2" /> My Contributions
                  </DropdownItem>
                  <DropdownDivider className="my-1 border-gray-100/50" />
                  <DropdownItem onClick={handleLogout} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                    <FiLogOut className="mr-2" /> {t("nav.logout")}
                  </DropdownItem>
                </Dropdown>
              </div>
            ) : (
              <button
                onClick={() => setAuth("login")}
                className="px-5 py-2 bg-[#2D6A4F] text-white text-sm font-bold rounded-lg hover:bg-[#1B4332] transition-colors cursor-pointer"
              >
                {t("nav.login")}
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-800"
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
                className="block px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F0FBF4] hover:text-[#2D6A4F] rounded-lg"
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/dashboard/saved-campaigns"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F0FBF4] hover:text-[#2D6A4F] rounded-lg"
              >
                <FiBookmark size={14} /> Saved Missions
              </NavLink>
            )}
            {user && (
              <Link
                to="/campaigns/create"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 bg-[#2D6A4F] text-white text-sm font-bold rounded-lg"
              >
                <FaPlus size={11} /> {t("nav.start_mission")}
              </Link>
            )}
            {!user && (
              <button
                onClick={() => {
                  setAuth("login");
                  setIsMenuOpen(false);
                }}
                className="w-full text-center px-3 py-2.5 bg-[#2D6A4F] text-white text-sm font-bold rounded-lg"
              >
                {t("nav.login")}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
