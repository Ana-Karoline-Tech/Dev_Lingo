import { Flame, Star, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/authContext';

interface HeaderProps {
  xp?: number;
  streak?: number;
  level?: number;
}

export default function Header({ xp = 0, streak = 0, level = 1 }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-slate-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Logo/Nome */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow-400 text-sm font-bold text-black">
            JS
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#8B00FF]">
            DEV<span className="text-slate-700">LINGO</span>
          </span>
        </div>

        {/* Indicadores */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-1.5" title="Ofensiva">
            <Flame className="h-6 w-6 fill-orange-500 text-orange-500" />
            <span className="text-lg font-bold text-slate-500">{streak}</span>
          </div>
          
          <div className="flex items-center gap-1.5" title="XP Total">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-bold text-slate-500">{xp}</span>
          </div>

          <div className="flex items-center gap-1.5" title="Nível">
            <Trophy className="h-6 w-6 fill-blue-500 text-blue-500" />
            <span className="text-lg font-bold text-slate-500">{level}</span>
          </div>

          {/* Logout */}
          <button
            onClick={signOut}
            className="ml-2 flex items-center gap-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
            title="Sair"
          >
            <LogOut size={22} />
            <span className="hidden text-sm font-bold md:block">SAIR</span>
          </button>
        </div>
      </div>
    </header>
  );
}
