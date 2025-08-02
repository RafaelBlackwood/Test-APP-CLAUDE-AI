import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth Provider
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import { Layout } from './components/layout/Layout';

// Auth Components
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { TwoFactorSetupPage } from './pages/TwoFactorSetupPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Constants
import { ROUTES } from './constants';
import { UserRole } from './types';

// Placeholder components for routes that haven't been implemented yet
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="text-center py-16">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600">This page is coming soon!</p>
  </div>
);

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path={ROUTES.UNIVERSITIES} element={<PlaceholderPage title="Universities" />} />
              <Route path={ROUTES.UNIVERSITY_DETAIL} element={<PlaceholderPage title="University Details" />} />
              <Route path={ROUTES.PROGRAMS} element={<PlaceholderPage title="Programs" />} />
              <Route path={ROUTES.PROGRAM_DETAIL} element={<PlaceholderPage title="Program Details" />} />
              <Route path={ROUTES.SCHOLARSHIPS} element={<PlaceholderPage title="Scholarships" />} />
              <Route path={ROUTES.HELP} element={<PlaceholderPage title="Help Center" />} />
              <Route path={ROUTES.CONTACT} element={<PlaceholderPage title="Contact Us" />} />
              <Route path={ROUTES.PRIVACY} element={<PlaceholderPage title="Privacy Policy" />} />
              <Route path={ROUTES.TERMS} element={<PlaceholderPage title="Terms of Service" />} />
            </Route>

            {/* Auth Routes (no layout) */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/setup-2fa" element={
              <ProtectedRoute>
                <TwoFactorSetupPage />
              </ProtectedRoute>
            } />

            {/* Protected Student Routes */}
            <Route path={ROUTES.DASHBOARD} element={
              <ProtectedRoute roles={[UserRole.STUDENT, UserRole.COUNSELOR, UserRole.ADMIN]}>
                <Layout showSidebar>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.PROFILE} element={
              <ProtectedRoute roles={[UserRole.STUDENT, UserRole.COUNSELOR, UserRole.ADMIN]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Profile" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.SETTINGS} element={
              <ProtectedRoute roles={[UserRole.STUDENT, UserRole.COUNSELOR, UserRole.ADMIN]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Settings" />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Student-specific routes */}
            <Route path={ROUTES.APPLICATIONS} element={
              <ProtectedRoute roles={[UserRole.STUDENT]}>
                <Layout showSidebar>
                  <PlaceholderPage title="My Applications" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.APPLICATION_DETAIL} element={
              <ProtectedRoute roles={[UserRole.STUDENT]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Application Details" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.APPLICATION_CREATE} element={
              <ProtectedRoute roles={[UserRole.STUDENT]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Create Application" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.DOCUMENTS} element={
              <ProtectedRoute roles={[UserRole.STUDENT]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Documents" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.ESSAYS} element={
              <ProtectedRoute roles={[UserRole.STUDENT]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Essays" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.RECOMMENDATIONS} element={
              <ProtectedRoute roles={[UserRole.STUDENT]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Recommendations" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.DEADLINES} element={
              <ProtectedRoute roles={[UserRole.STUDENT]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Deadlines" />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path={ROUTES.ADMIN} element={
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Admin Dashboard" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.ADMIN_USERS} element={
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Admin - Users" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.ADMIN_UNIVERSITIES} element={
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Admin - Universities" />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.ADMIN_APPLICATIONS} element={
              <ProtectedRoute roles={[UserRole.ADMIN, UserRole.COUNSELOR]}>
                <Layout showSidebar>
                  <PlaceholderPage title="Admin - Applications" />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              className: 'toast',
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #E5E7EB',
                borderRadius: '0.75rem',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
