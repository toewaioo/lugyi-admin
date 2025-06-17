import React from "react"; // No useState needed here if state is lifted
import { Link } from "react-router"; // Use react-router-dom Link if you are using it
import HomeIcon from "../../icons/HomeIcon";
import PersonIcon from "../../icons/PersonIcon";
import ContentIcon from "../../icons/ContnentIcon";
import KeyIcon from "../../icons/Key";

// Removed MenuIcon import as it's now in Header

const Sidebar = ({ isOpen, setIsOpen }) => {
  // Accept isOpen and setIsOpen as props
  return (
    <>
      {/* Mobile Menu Button - Removed from here */}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 bg-gray-900 text-white w-64 p-4
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:flex-shrink-0
          transition-transform duration-300 ease-in-out z-40
        `}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Menu</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700"
                onClick={() => setIsOpen(false)} // Close on navigation for mobile
              >
                <HomeIcon /> <span className="ml-2">Dashboard</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/devices"
                className="flex items-center px-4 py-2 pr-2 rounded-md hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <PersonIcon className="pr-21 mr-5" />
                <span className="ml-2">Devices</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/contents"
                className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <ContentIcon />  <span className="ml-2">Contents</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/subscriptions"
                className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <KeyIcon /> <span className="ml-2">Subscriptions</span>
              </Link>
            </li>
            {/* Add more navigation links */}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
