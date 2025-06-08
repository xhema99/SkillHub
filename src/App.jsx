import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import DashboardCandidate from "./Candidate/DashboardCandidate";
import DashboardRecruiter from "./Recruiter/DashboardRecruiter";
import DashboardAdmin from "./Admin/DashboardAdmin";

import { AuthProvider } from "./context/Auth";
import { RequireAuth } from "./components/RequireAuth";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protegidas por rol */}
          <Route
            path="/candidate/dashboard/*"
            element={
              <RequireAuth roles={["candidate"]}>
                <DashboardCandidate />
              </RequireAuth>
            }
          />
          <Route
            path="/recruiter/dashboard/*"
            element={
              <RequireAuth roles={["recruiter"]}>
                <DashboardRecruiter />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth roles={["admin"]}>
                <DashboardAdmin />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
