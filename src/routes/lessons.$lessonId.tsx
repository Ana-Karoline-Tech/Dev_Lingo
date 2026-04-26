import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { X, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/lessons/$lessonId')({
  component: LessonPage,
});

interface Question {
  id: string;
  question_text: string;
  options: {
    id: string;
    option_text: string;
    is_correct: boolean;
  }[];
}

function LessonPage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'finished'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from('lesson_questions')
        .select(`
          id,
          question_text,
          options:lesson_question_options(id, option_text, is_correct)
        `)
        .eq('lesson_id', lessonId)
        .order('position', { ascending: true });

      if (error) console.error(error);
      else setQuestions(data || []);
      setLoading(false);
    }
    fetchQuestions();
  }, [lessonId]);

  const handleCheck = () => {
    const currentQuestion = questions[currentIdx];
    const selectedOption = currentQuestion.options.find(opt => opt.id === selectedOptionId);

    if (selectedOption?.is_correct) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  const handleContinue = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setStatus('idle');
    } else {
      // Finalizou a lição
      setStatus('finished');
      await saveProgress();
      navigate({ to: '/' });
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

  const currentQuestion = questions[currentIdx];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header com Progresso */}
      <header className="flex items-center gap-4 p-6">
        <button onClick={() => navigate({ to: '/' })} className="text-slate-400 hover:text-slate-600">
          <X size={28} />
        </button>
        <div className="h-4 flex-1 rounded-full bg-slate-100">
          <div 
            className="h-full rounded-full bg-[#58cc02] transition-all duration-500" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Pergunta */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-10">
        <h1 className="text-3xl font-bold text-slate-800">
          {currentQuestion?.question_text}
        </h1>

        <div className="mt-8 space-y-3">
          {currentQuestion?.options.map((option) => (
            <button
              key={option.id}
              onClick={() => status === 'idle' && setSelectedOptionId(option.id)}
              className={`w-full rounded-2xl border-2 border-b-4 p-4 text-left text-lg font-bold transition-all active:border-b-2 ${
                selectedOptionId === option.id
                  ? 'border-[#84d8ff] bg-[#ddf4ff] text-[#1899d6]'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {option.option_text}
            </button>
          ))}
        </div>
      </main>

      {/* Footer de Verificação */}
      <footer className={`border-t-2 p-6 transition-colors ${
        status === 'correct' ? 'border-[#d7ffb8] bg-[#d7ffb8]' : 
        status === 'wrong' ? 'border-[#ffdfe0] bg-[#ffdfe0]' : 'border-slate-100'
      }`}>
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-4">
            {status === 'correct' && (
              <>
                <div className="rounded-full bg-white p-2 text-[#58cc02]">
                  <CheckCircle2 size={32} />
                </div>
                <span className="text-xl font-black text-[#58a700]">Muito bem!</span>
              </>
            )}
            {status === 'wrong' && (
              <>
                <div className="rounded-full bg-white p-2 text-[#ea2b2b]">
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
            onClick={status === 'idle' ? handleCheck : handleContinue}
            disabled={!selectedOptionId}
            className={`rounded-2xl px-12 py-3 text-lg font-black uppercase tracking-wide transition-all disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${
              status === 'correct' ? 'bg-[#58cc02] text-white' :
              status === 'wrong' ? 'bg-[#ea2b2b] text-white' : 'bg-[#58cc02] text-white'
            }`}
          >
            {status === 'idle' ? 'Verificar' : 'Continuar'}
          </button>
        </div>
      </footer>
    </div>
  );
}
