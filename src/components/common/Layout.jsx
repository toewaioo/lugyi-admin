import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "../common/Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Pass the toggle function */}
        <main className="flex-1 p-4 bg-gray-50 overflow-auto">
          {children} {/* This will render your page content */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
