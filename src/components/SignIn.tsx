import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (_data: SignInFormData): Promise<void> => {
    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#8B00FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-center text-3xl font-bold text-slate-900">Bem-vindo de volta!</h1>
        <p className="mt-3 text-center text-base text-gray-500">Entre na sua conta para continuar</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="mb-2 block text-base font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-[#8B00FF] focus:ring-2 focus:ring-[#8B00FF]/30 placeholder:text-gray-300"
              {...register('email')}
            />
            {errors.email ? (
              <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-base font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-[#8B00FF] focus:ring-2 focus:ring-[#8B00FF]/30 placeholder:text-gray-300"
              {...register('password')}
            />
            {errors.password ? (
              <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#8B00FF] text-lg font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Entrar'}
          </button>
        </form>

        <p className="mt-8 text-center text-base text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/signup" className="font-semibold text-[#8B00FF] hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
