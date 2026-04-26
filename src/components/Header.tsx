import { LogOut } from 'lucide-react';
import { IoDiamond, IoHeart } from 'react-icons/io5';

interface HeaderProps {
  diamonds?: number;
  livesLabel?: string;
  languageLabel?: string;
  onLogout?: () => void;
}

export default function Header({
  diamonds = 20,
  livesLabel = '∞',
  languageLabel = 'JS',
  onLogout,
}: HeaderProps) {
  return (
    <header className="w-full bg-white px-6 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow-400 text-sm font-bold text-black">
          {languageLabel}
        </div>

        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2 text-gray-700">
            <IoDiamond className="text-xl text-blue-500" />
            <span className="text-3xl font-bold leading-none">{diamonds}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <IoHeart className="text-xl text-red-500" />
            <span className="text-3xl font-bold leading-none">{livesLabel}</span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-3xl font-semibold">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
