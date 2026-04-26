import { supabase } from './supabaseClient';
import type { Lesson, Unit } from '../types';

type UnitRow = Omit<Unit, 'lessons'> & {
  lessons?: Lesson[] | null;
};

type UserLessonRow = {
  lesson_id: string;
  is_completed: boolean;
};

export async function getUnits(): Promise<Unit[]> {
  const { data: unitsData, error: unitsError } = await supabase
    .from('units')
    .select(
      '*, lessons(*, lesson_questions(*, lesson_question_options(*)))'
    )
    .order('created_at', { ascending: true });

  if (unitsError) {
    throw unitsError;
  }

  const units = (unitsData as UnitRow[] | null) ?? [];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let completedIds = new Set<string>();

  if (session) {
    const { data: userLessonsData, error: userLessonsError } = await supabase
      .from('user_lessons')
      .select('lesson_id, is_completed')
      .eq('user_id', session.user.id);

    if (userLessonsError) {
      throw userLessonsError;
    }

    const userLessons = (userLessonsData as UserLessonRow[] | null) ?? [];
    completedIds = new Set(
      userLessons.filter((lesson) => lesson.is_completed).map((lesson) => lesson.lesson_id)
    );
  }

  return units.map((unit) => ({
    ...unit,
    lessons: (unit.lessons ?? []).map((lesson) => ({
      ...lesson,
      completed: completedIds.has(lesson.id),
      lesson_questions: (lesson.lesson_questions ?? []).sort((a, b) => a.position - b.position).map((question) => ({
        ...question,
        lesson_question_options: (question.lesson_question_options ?? []).sort(
          (a, b) => a.position - b.position
        ),
      })),
    })),
  }));
}
