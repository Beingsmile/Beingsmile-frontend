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
import { useContext, useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";

export function NavComponent({ setAuth }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout()
    .then(() => {
      toast.success("Logged out successfully");
    }).catch((error) => {
      toast.error(`Logout failed: ${error.message}`);
    });
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    localStorage.getItem("theme") === "light"
      ? localStorage.setItem("theme", "dark")
      : localStorage.setItem("theme", "light");
  };
  return (
    <Navbar fluid>
      <NavbarBrand href="https://beingsmile.com">
        {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" /> */}
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
                <span className="block text-sm font-bold">{ user.data?.name }</span>
                <span className="block truncate text-sm font-medium text-blue-400">
                  {user.data?.email}
                </span>
              </DropdownHeader>
              <DropdownItem>Dashboard</DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem>Earnings</DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={async () => await handleLogout()}>Sign out</DropdownItem>
            </Dropdown>
          ) : (
            <button
              className="
    px-4 py-2 
    bg-blue-600 hover:bg-blue-700 
    text-white font-medium rounded-lg 
    transition-colors duration-200 
    dark:bg-blue-500 dark:hover:bg-blue-600
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    dark:focus:ring-offset-gray-800
    text-sm sm:text-base
    cursor-pointer
  "
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
          <NavbarLink href="#" active>
            Home
          </NavbarLink>
          <NavbarLink href="/browse-campaigns">Campaigns</NavbarLink>
          <NavbarLink href="/start-campaign">Start Fundraising</NavbarLink>
          <NavbarLink href="#">Contact</NavbarLink>
          <div className="relative w-40 lg:w-64">
            {" "}
            {/* Fixed width */}
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
