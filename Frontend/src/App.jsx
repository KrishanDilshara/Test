import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Layout from "./components/Layout";

// Pages
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const UserManagement = React.lazy(() => import("./pages/UserManagement"));
const Leaderboard = React.lazy(() => import("./pages/Leaderboard"));
const HomePage = React.lazy(() => import("./pages/HomePage"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated — any logged-in user */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin / Lecturer only */}
              <Route
                path="/users"
                element={
                  <RoleProtectedRoute allowedRoles={["admin", "lecturer"]}>
                    <UserManagement />
                  </RoleProtectedRoute>
                }
              />

              {/* Home Page */}
              <Route path="/" element={<HomePage />} />
              
              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;