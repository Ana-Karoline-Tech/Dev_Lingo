import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../contexts/authContext';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const navigate = useNavigate();
  const { location } = useRouterState();

  // Gerencia o redirecionamento baseado na autenticação
  useEffect(() => {
    if (!isLoading) {
      const isAuthPath = location.pathname === '/signin' || location.pathname === '/signup';
      
      if (isAuthenticated && isAuthPath) {
        navigate({ to: '/' });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // Se o contexto ainda está carregando a sessão inicial, mostramos o loader
  if (isLoading || showLoader) {
    return <LoadingScreen onFinished={() => setShowLoader(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#8B00FF]">
      <Outlet />
    </div>
  );
}
