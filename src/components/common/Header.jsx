import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/redux/authActions"; // Assuming you have this action
import { useNavigate } from "react-router";
import MenuIcon from "../../icons/MenuIcon"; // Import the MenuIcon

const Header = ({ toggleSidebar }) => { // Accept toggleSidebar prop
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="top-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg p-4 flex items-center justify-between h-16">
      {/* Left side: Logo/Brand Name and Mobile Menu Button */}
      <div className="flex items-center">
        {/* Mobile Menu Button - Visible only on small screens */}
        <button
          className="md:hidden p-2 text-white bg-gray-700 rounded-md mr-3" // Added mr-3 for spacing
          onClick={toggleSidebar} // Use the passed toggleSidebar function
        >
          <MenuIcon />
        </button>
        <span
          className="text-2xl font-extrabold tracking-tight cursor-pointer hover:text-blue-300 transition-colors duration-200"
          onClick={() => navigate("/")}
        >
          AdminPanel
        </span>
      </div>

      {/* Right side: User Info and Logout */}
      <div className="flex items-center space-x-4">
        {user && (
          <span className="text-sm font-medium text-gray-300 hidden md:inline">
            Welcome, {user.name || user.email || "Admin"}!
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;