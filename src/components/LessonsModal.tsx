import { X, Check, Play, RotateCcw } from 'lucide-react';
import devlingoChar from '../assets/images/devlingo-char.png';
import { Lesson } from '../types';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson;
  unitNumber: number;
  onStartLesson: (lessonId: string) => void;
}

export default function LessonModal({
  isOpen,
  onClose,
  lesson,
  unitNumber,
  onStartLesson,
}: LessonModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm rounded-3xl bg-[#8B00FF] p-8 shadow-2xl animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-purple-200 transition-colors hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Cabeçalho */}
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-200">
            Unidade {unitNumber} • Lição
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">{lesson.title}</h2>
        </div>

        {/* Descrição e XP */}
        <div className="mb-8 rounded-2xl bg-[#7A00E0] p-6 text-center border-b-4 border-[#6B00C7]">
          <p className="text-lg text-purple-100">{lesson.description}</p>
          <div className="mt-4 flex items-center justify-center gap-2 font-bold text-[#58cc02]">
            <StarIcon />
            <span>+{lesson.xp} XP</span>
          </div>
        </div>

        {/* Botão de Ação */}
        <button
          className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xl font-black uppercase tracking-wide transition-all active:scale-95 shadow-[0_5px_0_rgba(0,0,0,0.2)] ${
            lesson.completed 
              ? 'bg-[#58cc02] text-white hover:bg-[#4ead02]' 
              : 'bg-white text-[#8B00FF] hover:bg-purple-50'
          }`}
          onClick={() => {
            onStartLesson(lesson.id);
          }}
        >
          {lesson.completed ? (
            <>
              <RotateCcw size={24} strokeWidth={3} />
              Revisar
            </>
          ) : (
            <>
              <Play size={24} fill="currentColor" />
              Começar
            </>
          )}
        </button>

        {/* Personagem Coruja */}
        <img
          src={devlingoChar}
          alt="Coruja Devlingo"
          className="absolute -bottom-10 -right-6 h-36 w-36 object-contain drop-shadow-2xl z-10"
        />

        {/* Indicador de Status no Topo */}
        {lesson.completed && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#58cc02] px-4 py-1 text-xs font-black uppercase text-white shadow-lg">
            Concluída
          </div>
        )}
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}
