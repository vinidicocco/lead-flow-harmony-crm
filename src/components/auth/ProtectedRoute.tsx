
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: 'MASTER' | 'ADMIN' | 'USER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  requiredRole 
}) => {
  const { user, isLoading, hasPermission } = useAuth();
  const location = useLocation();
  const [permissionGranted, setPermissionGranted] = React.useState<boolean | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = React.useState(!!requiredPermission);

  // Verificar permissão se necessário
  React.useEffect(() => {
    const checkPermission = async () => {
      if (requiredPermission && user) {
        setIsCheckingPermission(true);
        const result = await hasPermission(requiredPermission);
        setPermissionGranted(result);
        setIsCheckingPermission(false);
      } else {
        setPermissionGranted(true);
      }
    };

    if (user) {
      checkPermission();
    }
  }, [user, requiredPermission, hasPermission]);

  // Verificar roles
  const checkRole = () => {
    if (!requiredRole || !user) return true;
    
    // MASTER pode acessar tudo
    if (user.role === 'MASTER') return true;
    
    // ADMIN pode acessar rotas de ADMIN e USER
    if (user.role === 'ADMIN' && (requiredRole === 'ADMIN' || requiredRole === 'USER')) return true;
    
    // USER só pode acessar rotas de USER
    if (user.role === 'USER' && requiredRole === 'USER') return true;
    
    return false;
  };

  // Mostrar loading enquanto verifica autenticação e permissão
  if (isLoading || isCheckingPermission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permissão específica
  if (requiredPermission && permissionGranted === false) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Verificar role
  if (!checkRole()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
