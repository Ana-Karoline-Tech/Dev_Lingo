import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import UnitBanner from '../components/UnitBanner';
import LessonModal from '../components/LessonsModal';
import { supabase } from '../services/supabaseClient';
import { Lesson } from '../types';
import { getUnits } from '../services/unitsService';
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
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentUnit, setCurrentUnit] = useState<{title: string, number: number}>({ title: 'Carregando...', number: 1 });
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const units = await getUnits();
        
        // Combina todas as lições de todas as unidades em uma lista única
        const allLessons = units.flatMap(unit => unit.lessons ?? []);
        
        // Define as lições da trilha (as 5 primeiras encontradas no banco)
        setLessons(allLessons.slice(0, 5));

        if (units.length > 0) {
          setCurrentUnit({
            title: units[0].title,
            number: 1,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const openLesson = (index: number) => {
    if (lessons[index]) {
      setSelectedLesson(lessons[index]);
    }
  };

  const startLesson = (lessonId: string) => {
    setSelectedLesson(null);
    navigate({ to: '/lessons/$lessonId', params: { lessonId } });
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#ececec]">
      <Header />
      <UnitBanner title={currentUnit.title} />

      <div className="mx-auto mt-10 flex w-full max-w-6xl justify-center px-6 pb-16">
        <div className="relative h-[620px] w-[420px]">
          {[
            { left: '175px', top: '0' },
            { left: '125px', top: '120px' },
            { left: '85px', top: '240px' },
            { left: '125px', top: '360px' },
            { left: '175px', top: '480px' },
          ].map((pos, index) => {
            const lesson = lessons[index];
            const isCompleted = lesson?.completed;
            // Disponível se for a primeira OU se a anterior estiver completa
            const isAvailable = index === 0 || lessons[index - 1]?.completed;

            return (
              <img
                key={index}
                src={isCompleted ? greenStar : grayStar}
                alt={isCompleted ? 'Concluída' : 'Bloqueada'}
                style={{ left: pos.left, top: pos.top }}
                className={`absolute h-[96px] w-[96px] transition-transform ${
                  lesson && isAvailable ? 'cursor-pointer hover:scale-110 active:scale-95' : 'opacity-50'
                }`}
                onClick={() => lesson && isAvailable && openLesson(index)}
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
          unitNumber={currentUnit.number}
          onStartLesson={startLesson}
        />
      )}
    </div>
  );
}
