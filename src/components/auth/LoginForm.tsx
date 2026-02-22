import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { loginSchema, type LoginFormData } from '@/schemas/loginSchema';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: Implementar lógica de login com Supabase
      console.log('Dados do formulário:', data);
      // await login(data.email, data.password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#8b21cf] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Bem-vindo de volta!
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Entre na sua conta para continuar
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b21cf] focus:ring-2 focus:ring-[#8b21cf] focus:ring-opacity-20 transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b21cf] focus:ring-2 focus:ring-[#8b21cf] focus:ring-opacity-20 transition-all"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8b21cf] hover:bg-[#7e1b8f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Entrar
          </button>

          {/* Signup Link */}
          <p className="text-center text-gray-700">
            Não tem uma conta?{' '}
            <Link
              to="/signup"
              className="text-[#8b21cf] font-semibold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
