import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DBTProvider } from './context/DBTContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import './i18n/i18n';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  if (isAdminRoute) {
    return (
      <>
        <AppRoutes />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <DBTProvider>

              <AppContent />
            </DBTProvider>
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;