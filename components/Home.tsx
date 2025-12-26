
import React from 'react';

interface Props {
  onContinue: () => void;
}

const Home: React.FC<Props> = ({ onContinue }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="relative overflow-hidden bg-slate-800 border border-slate-700 rounded-[3rem] p-10 md:p-16 shadow-2xl animate-in fade-in zoom-in duration-700">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="text-white font-black text-5xl">B</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic">
              Brasileirão <span className="text-blue-500">Manager</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              O simulador definitivo de gestão de futebol. Controle as finanças, gerencie seu estádio e conquiste o topo da tabela contra a IA ou seus amigos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-4">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
              <span className="text-2xl mb-2 block">📊</span>
              <h4 className="text-white font-bold text-sm uppercase mb-1">Tabela Viva</h4>
              <p className="text-slate-500 text-xs">Atualização em tempo real estilo Brasileirão.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
              <span className="text-2xl mb-2 block">💰</span>
              <h4 className="text-white font-bold text-sm uppercase mb-1">Gestão Orçamentária</h4>
              <p className="text-slate-500 text-xs">Controle patrocínios, salários e fluxo de caixa.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
              <span className="text-2xl mb-2 block">🤖</span>
              <h4 className="text-white font-bold text-sm uppercase mb-1">Narrador AI</h4>
              <p className="text-slate-500 text-xs">Comentários sarcásticos gerados por inteligência artificial.</p>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="group relative w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-lg flex items-center justify-center gap-3 active:scale-95"
          >
            Começar Carreira
            <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
          </button>

          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
            Versão 2.5 — Powered by Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
