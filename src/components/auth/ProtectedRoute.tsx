
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredPermission 
}) => {
  const { user, isLoading, hasPermission } = useAuth();

  // If still loading auth state, render nothing (could add a loading spinner)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirement if specified
  if (requiredRole) {
    if (requiredRole === 'super_admin' && user.role !== 'super_admin') {
      return <Navigate to="/" replace />;
    }
    
    if (requiredRole === 'org_admin' && user.role !== 'org_admin' && user.role !== 'super_admin') {
      return <Navigate to="/" replace />;
    }
  }

  // Check permission requirement if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
