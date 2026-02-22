import { createFileRoute } from '@tanstack/react-router';
import { SignUpForm } from '@/components/auth/SignupForm';

export const Route = createFileRoute('/signup')({
  component: SignupComponent,
});

function SignupComponent() {
  return <SignUpForm />;
}
