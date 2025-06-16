// src/components/common/Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router"; // Example icons
import MenuIcon from "../../icons/MenuIcon";
import HomeIcon from "../../icons/HomeIcon";
import PersonIcon from "../../icons/PersonIcon";
import ContentIcon from "../../icons/ContnentIcon";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 text-white bg-gray-700 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
       <MenuIcon/>
      </button>

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
                <HomeIcon/> Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/users"
                className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <PersonIcon/>Users
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/contents"
                className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <ContentIcon/> Contents
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
