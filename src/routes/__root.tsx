import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { supabase } from '../services/supabaseClient';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [showLoader, setShowLoader] = useState(true);
  const navigate = useNavigate();
  const { location } = useRouterState();

  useEffect(() => {
    // Verificar sessão inicial
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Se estiver logado e tentar acessar login/signup, vai para a home
      if (session && (location.pathname === '/signin' || location.pathname === '/signup')) {
        navigate({ to: '/' });
      }
    };

    checkUser();

    // Escutar mudanças na autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && (location.pathname === '/signin' || location.pathname === '/signup')) {
        navigate({ to: '/' });
      }
      if (event === 'SIGNED_OUT') {
        navigate({ to: '/signin' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-[#8B00FF]">
      {showLoader && (
        <LoadingScreen onFinished={() => setShowLoader(false)} />
      )}
      <Outlet />
    </div>
  );
}
