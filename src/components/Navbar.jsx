import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { useTheme } from "../hooks/useTheme";
import { Link, NavLink } from "react-router";

export function NavComponent({ setAuth }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout()
      .then(() => {
        toast.success("Logged out successfully");
      })
      .catch((error) => {
        toast.error(`Logout failed: ${error.message}`);
      });
  };

  // Custom NavLink component to work with Flowbite
  const FlowbiteNavLink = ({ to, children, ...props }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block py-2 px-3 md:p-0 rounded md:border-0 ${
          isActive
            ? "text-blue-700 bg-blue-50 md:bg-transparent md:text-blue-700 dark:text-blue-400 md:dark:text-blue-400"
            : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:hover:text-white md:dark:hover:text-blue-400"
        }`
      }
      {...props}
    >
      {children}
    </NavLink>
  );

  return (
    <Navbar fluid rounded>
      <NavbarBrand as={Link} to="/">
        <span className="max-w-screen-xl self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          BeingSmile
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="p-2 mr-3 md:mr-4 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {theme === "dark" ? (
            <FaSun className="text-yellow-300 text-xl" />
          ) : (
            <FaMoon className="text-gray-800 text-xl" />
          )}
        </button>
        <div className="mr-4">
          {user ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  rounded
                  className="cursor-pointer"
                />
              }
            >
              <DropdownHeader>
                <span className="block text-sm font-bold">{user.data?.name}</span>
                <span className="block truncate text-sm font-medium text-blue-400">
                  {user.data?.email}
                </span>
              </DropdownHeader>
              <DropdownItem as={Link} to="/dashboard">Dashboard</DropdownItem>
              <DropdownItem as={Link} to="/settings">Settings</DropdownItem>
              <DropdownItem as={Link} to="/earnings">Earnings</DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
            </Dropdown>
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm sm:text-base cursor-pointer"
              onClick={() => setAuth("login")}
            >
              Login
            </button>
          )}
        </div>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <div className="flex gap-3 lg:gap-6 md:flex-row flex-col lg:text-base items-center flex-nowrap p-3">
          <FlowbiteNavLink to="/">Home</FlowbiteNavLink>
          <FlowbiteNavLink to="/browse-campaigns">Campaigns</FlowbiteNavLink>
          <FlowbiteNavLink to="/start-campaign">Start Fundraising</FlowbiteNavLink>
          <FlowbiteNavLink to="/contact">Contact</FlowbiteNavLink>
          <div className="relative w-40 lg:w-64">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}