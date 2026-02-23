export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

export interface UserProfile {
  id: string; // uuid (pode ser gerado pelo Supabase ou fornecido)
  email: string;
  name?: string;
  avatar_url?: string | null;
  created_at?: string;
}
