import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { CitizenDashboard } from '@/features/citizen/CitizenDashboard';
import { ReportIssuePage } from '@/features/citizen/ReportIssuePage';
import { StaffDashboard } from '@/features/staff/StaffDashboard';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import { Footer } from '@/components/Footer'; 
import { useAuthStore } from '@/store/authStore';
import { AuthGate } from '@/components/AuthGate'; 
import { LanguageProvider } from '@/context/LanguageContext'; // ✅ The new manual system
import { LanguageToggle } from '@/components/LanguageToggle'; // ✅ The new toggle button

function App() {
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        
        {/* 🌐 CUSTOM FLOATING TOGGLE (Replaces Google Widget) */}
        <div className="fixed top-4 right-4 z-[9999]">
           <LanguageToggle />
        </div>

        <div className="flex-1">
          <Routes>
            <Route element={<Layout />}>
              {/* PUBLIC ROUTES */}
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
              
              {/* 🔒 PROTECTED ROUTES */}
              <Route element={<AuthGate allowedRoles={['citizen']} />}>
                <Route path="/citizen" element={<CitizenDashboard />} />
                <Route path="/citizen/complaint" element={<ReportIssuePage />} />
              </Route>
              
              <Route element={<AuthGate allowedRoles={['staff', 'admin']} />}>
                <Route path="/staff" element={<StaffDashboard />} />
              </Route>

              <Route element={<AuthGate allowedRoles={['admin']} />}>
                 <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

// Keep PublicRoute logic exactly the same
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (isAuthenticated && user) {
     if (user.role === 'admin') return <Navigate to="/admin" replace />;
     if (user.role === 'staff') return <Navigate to="/staff" replace />;
     return <Navigate to="/citizen" replace />;
  }
  return children;
};

export default App;