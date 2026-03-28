import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/types';

interface AuthGateProps {
  allowedRoles?: Role[];
}

export const AuthGate = ({ allowedRoles }: AuthGateProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 1. Check if logged in
  if (!isAuthenticated || !user) {
    // Redirect to login, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check Role Permissions (Optional)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they are logged in but don't have permission (e.g. Citizen trying to access Admin)
    // You can redirect them to their own home page
    const userHome = user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/citizen';
    return <Navigate to={userHome} replace />;
  }

  // 3. Allow Access
  return <Outlet />;
};