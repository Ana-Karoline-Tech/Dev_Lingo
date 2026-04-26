import { createFileRoute, redirect } from '@tanstack/react-router';
import Header from '../components/Header';
import UnitBanner from '../components/UnitBanner';
import { supabase } from '../services/supabaseClient';
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
  return (
    <div className="min-h-screen bg-[#ececec]">
      <Header />
      <UnitBanner />

      <div className="mx-auto mt-10 flex w-full max-w-6xl justify-center px-6 pb-16">
        <div className="relative h-[620px] w-[420px]">
          <img src={greenStar} alt="Fase concluída" className="absolute left-[175px] top-0 h-[96px] w-[96px]" />
          <img
            src={greenStar}
            alt="Fase concluída"
            className="absolute left-[125px] top-[120px] h-[96px] w-[96px]"
          />
          <img
            src={grayStar}
            alt="Fase bloqueada"
            className="absolute left-[85px] top-[240px] h-[96px] w-[96px]"
          />
          <img
            src={grayStar}
            alt="Fase bloqueada"
            className="absolute left-[125px] top-[360px] h-[96px] w-[96px]"
          />
          <img
            src={grayStar}
            alt="Fase bloqueada"
            className="absolute left-[175px] top-[480px] h-[96px] w-[96px]"
          />
          <img
            src={devlingoChar}
            alt="Coruja Devlingo"
            className="absolute left-[245px] top-[180px] h-[170px] w-[140px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
