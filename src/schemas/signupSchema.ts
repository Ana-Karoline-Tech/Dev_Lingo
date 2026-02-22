import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'O nome é obrigatório'),
    email: z
      .string()
      .email('Por favor, insira um e-mail válido'),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z
      .string()
      .min(8, 'A confirmação de senha deve ter no mínimo 8 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
