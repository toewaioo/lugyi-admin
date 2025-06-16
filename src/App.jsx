// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useDispatch } from "react-redux";
import { loadTokensFromStorage } from "./features/auth/redux/authActions"; // Corrected action name

import LoginPage from "./features/auth/components/LoginPage";
import AuthGuard from "./features/auth/AuthGuard";
import DashboardPage from "./pages/DashboardPage";
// import UserListPage from './features/users/components/UserListPage';
// import UserFormPage from './features/users/components/UserFormPage';
import ContentListPage from "./features/contents/components/ContentListPage";
import ContentFormPage from "./features/contents/components/ContentFormPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import ContentDetailsPage from "./features/contents/components/ContentDetailsPage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTokensFromStorage()); // Load tokens from storage on app start
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 bg-gray-50 overflow-auto">
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* <Route path="/users" element={<UserListPage />} />
                <Route path="/users/new" element={<UserFormPage />} />
                <Route path="/users/edit/:id" element={<UserFormPage />} /> */}
                <Route path="/contents" element={<ContentListPage />} />
                <Route path="/contents/new" element={<ContentFormPage />} />
                <Route path="/contents/details/:id" element={<ContentDetailsPage />} />
                <Route
                  path="/contents/edit/:id"
                  element={<ContentFormPage />}
                />
                {/* Add more protected routes */}
                <Route path="/" element={<DashboardPage />} />{" "}
                {/* Default protected route */}
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
