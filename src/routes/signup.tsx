import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/signup')({
  component: SignUpPage,
});

function SignUpPage(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#8B00FF] p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-slate-900">Criar conta</h1>
        <p className="mt-3 text-base text-gray-500">Tela de cadastro em construção.</p>

        <Link
          to="/"
          className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#8B00FF] text-lg font-bold text-white transition hover:opacity-90"
        >
          Voltar para login
        </Link>
      </div>
    </div>
  );
}
