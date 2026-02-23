import { supabase } from './supabaseClient';
import type { CreateUserProfileInput, CreateUserProfileResult } from '../types/user';

const USER_PROFILE_TABLE = 'user_profiles';

export const createUserProfile = async (
  input: CreateUserProfileInput,
): Promise<CreateUserProfileResult> => {
  const { name, email, password } = input;

  // 1. Cria o usuário no sistema de autenticação do Supabase (auth.users)
  if (!password) {
    return { success: false, error: 'Senha é obrigatória' };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  if (!authData.user) {
    return { success: false, error: 'Erro ao criar usuário' };
  }

  // 2. Insere dados adicionais na tabela user_profiles
  const { data: profileData, error: profileError } = await supabase
    .from(USER_PROFILE_TABLE)
    .insert({
      id: authData.user.id,
      name,
      email,
    })
    .select()
    .single();

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  return { success: true, data: profileData };
};