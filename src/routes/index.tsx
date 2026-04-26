import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import UnitBanner from '../components/UnitBanner';
import LessonModal from '../components/LessonsModal';
import { supabase } from '../services/supabaseClient';
import { Unit, Lesson } from '../types';
import greenStar from '../assets/images/green-star.png';
import grayStar from '../assets/images/gray-star.png';
import devlingoChar from '../assets/images/devlingo-char.png';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw redirect({
        to: '/signin',
      });
    }
    
    return { session };
  },
  component: HomeComponent,
});

function HomeComponent() {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca a primeira unidade e suas lições
        const { data: unitsData, error: unitError } = await supabase
          .from('units')
          .select('*, lessons(*)')
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        if (unitError) throw unitError;

        // Verifica quais lições o usuário já completou
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: userLessons } = await supabase
            .from('user_lessons')
            .select('lesson_id, is_completed')
            .eq('user_id', session.user.id);

          const completedIds = new Set(userLessons?.filter(ul => ul.is_completed).map(ul => ul.lesson_id));
          
          if (unitsData && unitsData.lessons) {
            unitsData.lessons = unitsData.lessons.map((l: any) => ({
              ...l,
              completed: completedIds.has(l.id)
            }));
          }
        }

        setUnit(unitsData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const openLesson = (index: number) => {
    if (unit?.lessons && unit.lessons[index]) {
      setSelectedLesson(unit.lessons[index]);
    }
  };

  const startLesson = (lessonId: string) => {
    setSelectedLesson(null);
    navigate({ to: '/lessons/$lessonId', params: { lessonId } });
  };

  if (isLoading) return null; // O root loader já cuida disso, mas por segurança...

  return (
    <div className="min-h-screen bg-[#ececec]">
      <Header />
      <UnitBanner title={unit?.title} />

      <div className="mx-auto mt-10 flex w-full max-w-6xl justify-center px-6 pb-16">
        <div className="relative h-[620px] w-[420px]">
          {/* Mapeamento das 5 lições para as posições da trilha */}
          {[
            { left: '175px', top: '0' },
            { left: '125px', top: '120px' },
            { left: '85px', top: '240px' },
            { left: '125px', top: '360px' },
            { left: '175px', top: '480px' },
          ].map((pos, index) => {
            const lesson = unit?.lessons?.[index];
            const isCompleted = lesson?.completed;
            const isAvailable = index === 0 || unit?.lessons?.[index - 1]?.completed;

            return (
              <img
                key={index}
                src={isCompleted ? greenStar : grayStar}
                alt={isCompleted ? 'Concluída' : 'Bloqueada'}
                style={{ left: pos.left, top: pos.top }}
                className={`absolute h-[96px] w-[96px] transition-transform ${
                  isAvailable ? 'cursor-pointer hover:scale-110 active:scale-95' : 'opacity-80'
                }`}
                onClick={() => isAvailable && openLesson(index)}
              />
            );
          })}
          
          <img
            src={devlingoChar}
            alt="Coruja Devlingo"
            className="absolute left-[245px] top-[180px] h-[170px] w-[140px] object-contain"
          />
        </div>
      </div>

      {selectedLesson && (
        <LessonModal 
          isOpen={!!selectedLesson} 
          onClose={() => setSelectedLesson(null)} 
          lesson={selectedLesson}
          unitNumber={1} // Por enquanto fixo ou unit.number se existir
          onStartLesson={startLesson}
        />
      )}
    </div>
  );
}
