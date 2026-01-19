import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/features/auth/LoginPage';
import { CitizenDashboard } from '@/features/citizen/CitizenDashboard';
import { StaffDashboard } from '@/features/staff/StaffDashboard';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import { Footer } from '@/components/Footer'; // ✅ Import Footer
import { useAuthStore } from '@/store/authStore';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated || !user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

// Redirect root to dashboard if already logged in
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (isAuthenticated && user) {
     if (user.role === 'admin') return <Navigate to="/admin" replace />;
     if (user.role === 'staff') return <Navigate to="/staff" replace />;
     return <Navigate to="/citizen" replace />;
  }
  return children;
};

function App() {
  return (
    // ✅ WRAPPER: Ensures Footer stays at the bottom
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* MAIN CONTENT GROWS TO FILL SPACE */}
      <div className="flex-1">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            
            <Route path="/citizen" element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/staff" element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
               <ProtectedRoute allowedRoles={['admin']}>
                   <AdminDashboard />
               </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </div>

      {/* ✅ FOOTER ADDED HERE */}
      <Footer />

    </div>
  );
}

export default App;