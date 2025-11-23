import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';

import UserMenuPage from './pages/UserMenuPage';
import CartPage from './pages/CartPage';
import UserOrdersPage from './pages/UserOrdersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminWorkersPage from './pages/AdminWorkersPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelledPage from './pages/PaymentCancelledPage';

const AppContent = () => {
  const location = useLocation();
  const hideNavBar = location.pathname === '/user/menu';

  return (
    <div className="min-h-screen bg-white">
      {!hideNavBar && <NavBar />}
      <main className={hideNavBar ? '' : 'w-full'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />

          {/* User area */}
          <Route
            path="/user/menu"
            element={
              <ProtectedRoute requiredRole="user">
                <UserMenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/cart"
            element={
              <ProtectedRoute requiredRole="user">
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <ProtectedRoute requiredRole="user">
                <UserOrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Admin area */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminMenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/workers"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminWorkersPage />
              </ProtectedRoute>
            }
          />

          {/* Payment */}
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AppContent />
  );
};

export default App;
