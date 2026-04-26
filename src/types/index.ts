export interface Profile {
  id: string;
  full_name: string | null;
  xp: number;
  level: number;
  streak: number;
  avatar_url: string | null;
  updated_at: string;
}

export interface UserAuth {
  id: string;
  email: string;
}
