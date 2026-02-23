import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { signupSchema, type SignupFormData } from '@/schemas/signupSchema';
import { Loader2 } from 'lucide-react';
import { createUserProfile } from '@/services/userService';

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    try {
      // Chama o serviço centralizado que cria o usuário no Auth e o perfil
      const result = await createUserProfile({ name: data.name, email: data.email, password: data.password });
      if (!result.success) {
        setServerError(result.error);
        return;
      }

      // Sucesso: redireciona para /home
      window.location.assign('/home');
    } catch (err) {
      setServerError('Erro inesperado ao criar conta. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#8b21cf] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Criar conta
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Cadastre-se para começar sua jornada
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Nome
            </label>
            <input
              type="text"
              placeholder="Seu nome completo"
              {...register('name')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b21cf] focus:ring-2 focus:ring-[#8b21cf] focus:ring-opacity-20 transition-all"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8b21cf] focus:ring-2 focus:ring-[#8b21cf] focus:ring-opacity-20 transition-all"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
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
            Criar conta
          </button>

          {serverError && (
            <p className="text-red-500 text-sm text-center mt-2">{serverError}</p>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">ou</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-700">
            Já tem uma conta?{' '}
            <Link
              to="/signin"
              className="text-[#8b21cf] font-semibold hover:underline"
            >
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
