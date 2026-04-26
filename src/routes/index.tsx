import { createFileRoute, redirect } from '@tanstack/react-router';
import { supabase } from '../services/supabaseClient';

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
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#8B00FF] p-4 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Bem-vindo ao Devlingo!</h1>
        <p className="text-xl">Você está autenticado e pronto para aprender.</p>
        
        <button
          onClick={handleLogout}
          className="mt-8 px-8 py-3 bg-white text-[#8B00FF] font-bold rounded-xl hover:bg-opacity-90 transition"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
