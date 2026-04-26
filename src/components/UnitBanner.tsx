interface UnitBannerProps {
  label?: string;
  title?: string;
}

export default function UnitBanner({
  label = 'COMEÇAR UNIDADE',
  title = 'Fundamentos de JavaScript',
}: UnitBannerProps) {
  return (
    <section className="mt-6 w-full px-6">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border-b-[6px] border-purple-800 bg-purple-600 p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-white/80">{label}</p>
        <h2 className="mt-2 text-2xl font-bold text-white md:text-4xl">{title}</h2>
      </div>
    </section>
  );
}
