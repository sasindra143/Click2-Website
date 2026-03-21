import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

/* ── Lazy-loaded pages ── */
const Home         = lazy(() => import('./pages/Home/Home'));
const Services     = lazy(() => import('./pages/Services/Services'));
const About        = lazy(() => import('./pages/About/About'));
const Blog         = lazy(() => import('./pages/Blog/Blog'));
const Testimonials = lazy(() => import('./pages/Testimonials/Testimonials'));
const Contact      = lazy(() => import('./pages/Contact/Contact'));
const LoginPage    = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword  = lazy(() => import('./pages/ResetPassword'));
const AdminLogin   = lazy(() => import('./pages/AdminLogin'));
const Dashboard    = lazy(() => import('./pages/Dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'));
const Welcome      = lazy(() => import('./pages/Welcome/Welcome'));
const NotFound     = lazy(() => import('./pages/NotFound/NotFound'));

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0818' }}>
      <div style={{ width: 42, height: 42, borderRadius: '50%', border: '3px solid rgba(167,139,250,0.2)', borderTopColor: '#a78bfa', animation: 'spin 0.75s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public pages */}
              <Route path="/"             element={<Home />} />
              <Route path="/services"     element={<Services />} />
              <Route path="/about"        element={<About />} />
              <Route path="/blog"         element={<Blog />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact"      element={<Contact />} />

              {/* Auth pages */}
              <Route path="/login"               element={<LoginPage />} />
              <Route path="/register"            element={<RegisterPage />} />
              <Route path="/forgot-password"     element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/admin-login"         element={<AdminLogin />} />

              {/* Protected */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/welcome"
                element={
                  <PrivateRoute>
                    <Welcome />
                  </PrivateRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
