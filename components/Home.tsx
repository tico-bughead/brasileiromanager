
import React from 'react';

interface Props {
  onContinue: () => void;
}

const Home: React.FC<Props> = ({ onContinue }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="relative overflow-hidden bg-slate-800 border border-slate-700 rounded-[3rem] p-10 md:p-16 shadow-2xl animate-in fade-in zoom-in duration-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
            <span className="text-white font-black text-5xl group-hover:scale-110 transition-transform">B</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase italic">
              Manager <span className="text-blue-500">PRO</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
              O sistema definitivo para gerenciar seus campeonatos de futebol. Crie ligas personalizadas, copas emocionantes e gerencie múltiplos torneios simultaneamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4">
            <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700/50 hover:border-blue-500/30 transition-all group">
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">📊</span>
              <h4 className="text-white font-black text-xs uppercase mb-2 tracking-widest">Multi-Ligas</h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Crie e gerencie vários campeonatos de pontos corridos.</p>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700/50 hover:border-amber-500/30 transition-all group">
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">🏆</span>
              <h4 className="text-white font-black text-xs uppercase mb-2 tracking-widest">Copas</h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Suporte a formato mata-mata para emoção máxima.</p>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <button
              onClick={onContinue}
              className="group relative w-full px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-[0.2em] text-xl flex items-center justify-center gap-4 active:scale-95"
            >
              Acessar Painel
              <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">
            Versão 3.0 — High Performance Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
