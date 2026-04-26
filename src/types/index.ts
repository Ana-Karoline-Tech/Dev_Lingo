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
  lesson_questions?: LessonQuestion[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons?: Lesson[];
}

export interface LessonQuestion {
  id: string;
  question_text: string;
  position: number;
  lesson_question_options?: LessonQuestionOption[];
}

export interface LessonQuestionOption {
  id: string;
  option_text: string;
  is_correct: boolean;
  position: number;
}
