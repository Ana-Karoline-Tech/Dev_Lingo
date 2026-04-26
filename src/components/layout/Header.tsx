import { Flame, Star, Trophy, LogOut } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function Header() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-slate-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Logo/Nome */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-[#8B00FF]">
            DEV<span className="text-slate-700">LINGO</span>
          </span>
        </div>

        {/* Indicadores */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-1.5" title="Ofensiva">
            <Flame className="h-6 w-6 fill-orange-500 text-orange-500" />
            <span className="text-lg font-bold text-slate-500">0</span>
          </div>
          
          <div className="flex items-center gap-1.5" title="XP Total">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-bold text-slate-500">0</span>
          </div>

          <div className="flex items-center gap-1.5 md:flex" title="Nível">
            <Trophy className="h-6 w-6 fill-blue-500 text-blue-500" />
            <span className="text-lg font-bold text-slate-500">1</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="ml-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
            title="Sair"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
