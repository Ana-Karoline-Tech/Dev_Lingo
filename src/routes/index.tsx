import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo/Ícone */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-white to-white/50 rounded-xl flex items-center justify-center text-4xl font-bold text-purple-600 shadow-lg">
                T
              </div>
            </div>
          </div>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          Template
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-white/90 mb-2 font-light">
          React + TypeScript + Tailwind + Supabase
        </p>

        {/* Badges de Tecnologias */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <TechBadge name="React" color="bg-blue-500" />
          <TechBadge name="TypeScript" color="bg-blue-600" />
          <TechBadge name="Tailwind CSS" color="bg-cyan-500" />
          <TechBadge name="Supabase" color="bg-green-500" />
        </div>

        {/* Instruções */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl max-w-md mx-auto">
          <p className="text-white/90 text-sm mb-4 font-medium">
            Para começar:
          </p>
          <div className="space-y-2 text-left">
            <CodeBlock command="npm i" />
            <CodeBlock command="npm run dev" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TechBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className={`${color} text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg backdrop-blur-sm border border-white/20`}
    >
      {name}
    </span>
  );
}

function CodeBlock({ command }: { command: string }) {
  return (
    <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-white/90 border border-white/10">
      <span className="text-green-400">$</span> {command}
    </div>
  );
}
