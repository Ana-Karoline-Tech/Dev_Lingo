import { createFileRoute, redirect } from '@tanstack/react-router';
import Header from '../components/Header';
import UnitBanner from '../components/UnitBanner';
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
    <div className="min-h-screen bg-[#ececec]">
      <Header onLogout={handleLogout} />
      <UnitBanner />

      <div className="mx-auto mt-10 flex w-full max-w-6xl justify-center px-6 pb-16">
        <div className="relative h-[620px] w-[420px]">
          <div className="absolute left-[175px] top-0 h-24 w-24 rounded-full bg-[#64d329] shadow-[inset_0_-8px_0_#44a71a,0_8px_16px_rgba(0,0,0,0.16)]">
            <span className="flex h-full items-center justify-center text-5xl text-white">★</span>
          </div>

          <div className="absolute left-[125px] top-[120px] h-24 w-24 rounded-full bg-[#64d329] shadow-[inset_0_-8px_0_#44a71a,0_8px_16px_rgba(0,0,0,0.16)]">
            <span className="flex h-full items-center justify-center text-5xl text-white">★</span>
          </div>

          <div className="absolute left-[85px] top-[240px] h-24 w-24 rounded-full bg-[#f4f5f7] shadow-[inset_0_-8px_0_#cfd3d8,0_8px_16px_rgba(0,0,0,0.08)]">
            <span className="flex h-full items-center justify-center text-5xl text-[#c5c8cd]">★</span>
          </div>

          <div className="absolute left-[125px] top-[360px] h-24 w-24 rounded-full bg-[#f4f5f7] shadow-[inset_0_-8px_0_#cfd3d8,0_8px_16px_rgba(0,0,0,0.08)]">
            <span className="flex h-full items-center justify-center text-5xl text-[#c5c8cd]">★</span>
          </div>

          <div className="absolute left-[175px] top-[480px] h-24 w-24 rounded-full bg-[#f4f5f7] shadow-[inset_0_-8px_0_#cfd3d8,0_8px_16px_rgba(0,0,0,0.08)]">
            <span className="flex h-full items-center justify-center text-5xl text-[#c5c8cd]">★</span>
          </div>

          <div className="absolute left-[245px] top-[185px] text-[110px] leading-none">🦉</div>
      </div>
      </div>
    </div>
  );
}
