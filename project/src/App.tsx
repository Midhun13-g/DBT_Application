import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DBTProvider } from './context/DBTContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import './i18n/i18n';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <DBTProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </DBTProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;