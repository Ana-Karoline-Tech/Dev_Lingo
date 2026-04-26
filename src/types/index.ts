export interface Profile {
  id: string;
  full_name?: string | null;
  name?: string;
  email: string;
  total_xp: number;
  level?: number;
  streak?: number;
  avatar_url?: string | null;
  updated_at: string;
}

export interface UserAuth {
  id: string;
  email: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  unit_id: string;
  completed?: boolean; // Campo virtual para UI
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons?: Lesson[];
}
