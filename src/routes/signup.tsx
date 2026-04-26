import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../services/supabaseClient';
import { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';

const signUpSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const Route = createFileRoute('/signup')({
  component: SignUpPage,
});

function SignUpPage(): JSX.Element {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Cadastro com sucesso - Redireciona para login ou home
      alert('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.');
      navigate({ to: '/signin' });
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao criar sua conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#8B00FF] p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/signin" className="text-gray-500 hover:text-[#8B00FF] transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Criar conta</h1>
        </div>

        <p className="mb-8 text-base text-gray-500 text-center">Comece sua jornada no Devlingo hoje!</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Nome completo</label>
            <input
              {...register('name')}
              type="text"
              placeholder="Seu nome"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#8B00FF] focus:ring-2 focus:ring-[#8B00FF]/30 transition"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="seu@email.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#8B00FF] focus:ring-2 focus:ring-[#8B00FF]/30 transition"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Senha</label>
            <input
              {...register('password')}
              type="password"
              placeholder="******"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#8B00FF] focus:ring-2 focus:ring-[#8B00FF]/30 transition"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#8B00FF] text-lg font-bold text-white transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/signin" className="font-bold text-[#8B00FF] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
