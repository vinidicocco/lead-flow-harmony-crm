
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-bold mt-6 mb-3">Página não encontrada</h2>
      <p className="text-gray-500 max-w-md mb-8">
        A página que você está procurando não existe ou foi movida para outro endereço.
      </p>
      <Button asChild>
        <Link to="/">Voltar para o Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;
