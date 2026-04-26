import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
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

const MOCK_UNIT: Unit = {
  id: 'unit-1',
  number: 1,
  title: 'Fundamentos de JavaScript',
  lessons: [
    {
      id: 'lesson-1',
      title: 'Variáveis e tipos',
      description: 'Aprenda sobre variáveis em JavaScript',
      xp: 10,
      completed: true,
    },
    {
      id: 'lesson-2',
      title: 'Estruturas de Controle',
      description: 'Condicionais e Loops básicos',
      xp: 15,
      completed: true,
    },
    {
      id: 'lesson-3',
      title: 'Funções',
      description: 'Como declarar e chamar funções',
      xp: 20,
      completed: false,
    },
    {
      id: 'lesson-4',
      title: 'Arrays',
      description: 'Manipulação de listas de dados',
      xp: 20,
      completed: false,
    },
    {
      id: 'lesson-5',
      title: 'Objetos',
      description: 'Estruturas de dados complexas',
      xp: 25,
      completed: false,
    }
  ]
};

function HomeComponent() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const openLesson = (index: number) => {
    setSelectedLesson(MOCK_UNIT.lessons[index]);
  };

  return (
    <div className="min-h-screen bg-[#ececec]">
      <Header />
      <UnitBanner />

      <div className="mx-auto mt-10 flex w-full max-w-6xl justify-center px-6 pb-16">
        <div className="relative h-[620px] w-[420px]">
          {/* Estrela 1 */}
          <img 
            src={greenStar} 
            alt="Fase concluída" 
            className="absolute left-[175px] top-0 h-[96px] w-[96px] cursor-pointer transition-transform hover:scale-110 active:scale-95" 
            onClick={() => openLesson(0)}
          />
          {/* Estrela 2 */}
          <img
            src={greenStar}
            alt="Fase concluída"
            className="absolute left-[125px] top-[120px] h-[96px] w-[96px] cursor-pointer transition-transform hover:scale-110 active:scale-95"
            onClick={() => openLesson(1)}
          />
          {/* Estrela 3 */}
          <img
            src={grayStar}
            alt="Fase bloqueada"
            className="absolute left-[85px] top-[240px] h-[96px] w-[96px] cursor-pointer transition-transform hover:scale-110"
            onClick={() => openLesson(2)}
          />
          {/* Estrela 4 */}
          <img
            src={grayStar}
            alt="Fase bloqueada"
            className="absolute left-[125px] top-[360px] h-[96px] w-[96px] cursor-pointer transition-transform hover:scale-110"
            onClick={() => openLesson(3)}
          />
          {/* Estrela 5 */}
          <img
            src={grayStar}
            alt="Fase bloqueada"
            className="absolute left-[175px] top-[480px] h-[96px] w-[96px] cursor-pointer transition-transform hover:scale-110"
            onClick={() => openLesson(4)}
          />
          
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
          unitNumber={MOCK_UNIT.number}
        />
      )}
    </div>
  );
}
