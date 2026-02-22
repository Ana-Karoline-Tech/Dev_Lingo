import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '@/components/auth/LoginForm';

export const Route = createFileRoute('/login')({
  component: LoginComponent,
});

function LoginComponent() {
  return <LoginForm />;
}
