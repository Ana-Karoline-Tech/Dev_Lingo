import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { X, Heart, Loader2, CheckCircle2, XCircle, Target, Zap } from 'lucide-react';
import devlingoChar from '../assets/images/devlingo-char.png';
import { findLessonInCache, getUnitsCache, setUnitsCache } from '../services/unitsCache';
import { getUnits } from '../services/unitsService';

export const Route = createFileRoute('/lessons/$lessonId')({
  component: LessonScreen,
});

interface Option {
  id: string;
  option_text: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  question_text: string;
  options: Option[];
}

function LessonScreen() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'finished'>('idle');
  const [lives, setLives] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        let lesson = findLessonInCache(lessonId);

        if (!lesson || !lesson.lesson_questions?.length) {
          const units = getUnitsCache();
          if (!units.length) {
            const fetchedUnits = await getUnits();
            setUnitsCache(fetchedUnits);
          }
          lesson = findLessonInCache(lessonId);
        }

        const parsedQuestions: Question[] = (lesson?.lesson_questions ?? []).map((question) => ({
          id: question.id,
          question_text: question.question_text,
          options: (question.lesson_question_options ?? []).map((option) => ({
            id: option.id,
            option_text: option.option_text,
            is_correct: option.is_correct,
          })),
        }));

        setQuestions(parsedQuestions);
      } catch (error) {
        console.error('Erro ao carregar questões da lição:', error);
      }
      setLoading(false);
    }
    fetchQuestions();
  }, [lessonId]);

  const handleCheck = () => {
    const currentQuestion = questions[currentIdx];
    const isCorrect = currentQuestion.options.find(o => o.id === selectedOptionId)?.is_correct;

    if (isCorrect) {
      setStatus('correct');
      setCorrectCount(prev => prev + 1);
    } else {
      setStatus('wrong');
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  const handleSkip = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setStatus('idle');
    } else {
      setStatus('finished');
      saveProgress();
    }
  };

  const handleContinue = async () => {
    if (status === 'wrong' && lives === 0) {
      navigate({ to: '/' });
      return;
    }

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setStatus('idle');
    } else {
      setStatus('finished');
      await saveProgress();
    }
  };

  const saveProgress = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from('user_lessons').upsert({
      user_id: session.user.id,
      lesson_id: lessonId,
      is_completed: true,
      completed_at: new Date().toISOString()
    });
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Loader2 className="h-10 w-10 animate-spin text-[#8B00FF]" />
    </div>
  );

  if (!questions.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
        <h1 className="text-3xl font-black text-gray-800">Nenhuma questão encontrada</h1>
        <p className="mt-3 text-gray-500">Esta lição ainda não possui perguntas cadastradas.</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-8 rounded-xl bg-[#58cc02] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#4ead02]"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (status === 'finished') {
    const totalXP = correctCount * 5;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
        <img src={devlingoChar} alt="Devlingo Owl" className="mb-8 w-48 object-contain" />
        <h1 className="mb-12 text-4xl font-black text-[#ffc800]">Lição concluída!</h1>
        <div className="mb-12 flex w-full max-w-md gap-4">
          <div className="flex-1 rounded-2xl border-2 border-[#ffdb4d] bg-[#fff9db] p-6 shadow-sm">
            <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#f59f00]">Total de XP</p>
            <div className="flex items-center justify-center gap-2">
              <Zap className="fill-[#ffc800] text-[#ffc800]" size={24} />
              <span className="text-2xl font-black text-[#f59f00]">{totalXP}</span>
            </div>
          </div>
          <div className="flex-1 rounded-2xl border-2 border-[#b8f2d1] bg-[#e8fcf1] p-6 shadow-sm">
            <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#1cb0f6]">Precisão</p>
            <div className="flex items-center justify-center gap-2">
              <Target className="text-[#37b24d]" size={24} strokeWidth={3} />
              <span className="text-2xl font-black text-[#37b24d]">{accuracy}%</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate({ to: '/' })}
          className="w-full max-w-md rounded-2xl bg-[#58cc02] py-4 text-xl font-black uppercase tracking-wide text-white shadow-[0_4px_0_#46a302] transition-all hover:bg-[#4ead02] active:translate-y-1 active:shadow-none"
        >
          Continuar
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-2xl items-center gap-4 p-6">
        <button onClick={() => navigate({ to: '/' })} className="text-gray-400 hover:text-gray-600 transition">
          <X size={28} />
        </button>
        
        <div className="h-4 flex-1 rounded-full bg-gray-200">
          <div 
            className="h-full rounded-full bg-[#58cc02] transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Heart className="fill-red-500 text-red-500" size={24} />
          <span className="text-lg font-bold text-rose-500">{lives}</span>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-10">
        <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
          {currentQuestion?.question_text}
        </h2>

        <div className="mt-10 space-y-4">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => status === 'idle' && setSelectedOptionId(option.id)}
              className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                selectedOptionId === option.id
                  ? 'border-blue-400 bg-blue-100 text-slate-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              } ${status !== 'idle' ? 'cursor-default' : ''}`}
            >
              <span className="text-lg font-bold">{option.option_text}</span>
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 text-xs text-gray-400 font-medium">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t border-gray-100 p-6 transition-colors ${
        status === 'correct' ? 'bg-[#d7ffb8]' : 
        status === 'wrong' ? 'bg-[#ffdfe0]' : 'bg-white'
      }`}>
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          {status === 'idle' ? (
            <>
              <button
                onClick={handleSkip}
                className="rounded-xl bg-gray-200 px-8 py-3 text-sm font-bold uppercase tracking-wider text-gray-700 transition hover:bg-gray-300"
              >
                Pular
              </button>
              <button
                disabled={!selectedOptionId}
                onClick={handleCheck}
                className="rounded-xl bg-[#58cc02] px-10 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#4ead02] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                Verificar
              </button>
            </>
          ) : (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                {status === 'correct' ? (
                  <>
                    <div className="rounded-full bg-white p-1 text-[#58cc02]">
                      <CheckCircle2 size={32} />
                    </div>
                    <span className="text-xl font-black text-[#58a700]">Muito bem!</span>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-white p-1 text-[#ea2b2b]">
                      <XCircle size={32} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-[#ea2b2b]">Ops! Errado.</span>
                      <span className="text-sm font-bold text-[#ea2b2b]">Resposta correta: {currentQuestion.options.find(o => o.is_correct)?.option_text}</span>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleContinue}
                className={`rounded-xl px-10 py-3 text-sm font-bold uppercase tracking-wider text-white transition ${
                  status === 'correct' ? 'bg-[#58cc02] hover:bg-[#4ead02]' : 'bg-[#ea2b2b] hover:bg-[#c92222]'
                }`}
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
