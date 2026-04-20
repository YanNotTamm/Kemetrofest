import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Tenants from './pages/admin/Tenants';
import Partners from './pages/admin/Partners';
import Settings from './pages/admin/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

import { useEffect } from 'react';
import { syncFromCloud } from './lib/sync';

function App() {
  useEffect(() => {
    syncFromCloud();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />

        {/* Admin portal — hidden, only via /admin path */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="partners" element={<Partners />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {/* Toast Notification System */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#B8FF3B',
            color: '#141414',
            border: '3px solid #141414',
            borderRadius: '16px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            boxShadow: '0 8px 0 #141414',
          },
        }}
        richColors
      />
    </Router>
  );
}

export default App;
