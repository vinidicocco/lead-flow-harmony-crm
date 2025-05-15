
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo Accounts:</p>
          <p>SALT Profile: salt@example.com / password</p>
          <p>GHF Profile: ghf@example.com / password</p>
          <p>NEOIN Profile: neoin@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
