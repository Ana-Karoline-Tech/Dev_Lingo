import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { LoginForm } from '@/components/auth/LoginForm';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const Route = createFileRoute('/signin')({
  component: SigninComponent,
});

function SigninComponent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: '/' });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Carregando...
      </div>
    );
  }

  return <LoginForm />;
}
