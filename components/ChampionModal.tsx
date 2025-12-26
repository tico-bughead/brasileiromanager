
import React from 'react';
import { StandingRow, Team } from '../types';

interface Props {
  champion: StandingRow;
  teamDetails: Team | undefined;
  onClose: () => void;
}

const ChampionModal: React.FC<Props> = ({ champion, teamDetails, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full bg-slate-900 border-2 border-amber-500/50 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Background Decorativo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col items-center text-center">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <h2 className="text-amber-500 font-black text-xs uppercase tracking-[0.4em] mb-2">Grande Campeão</h2>
          <h3 className="text-4xl font-black text-white leading-tight mb-1 uppercase tracking-tighter">
            {champion.teamName}
          </h3>
          <p className="text-slate-400 font-bold text-sm mb-8">Comandado por: {teamDetails?.playerName || 'IA'}</p>

          <div className="grid grid-cols-3 gap-4 w-full mb-8">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Pontos</p>
              <p className="text-xl font-black text-white">{champion.points}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Vitórias</p>
              <p className="text-xl font-black text-white">{champion.won}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Saldo</p>
              <p className="text-xl font-black text-white">{champion.gd}</p>
            </div>
          </div>

          <p className="text-slate-300 text-sm italic mb-8 leading-relaxed">
            "Uma campanha histórica! O {champion.teamName} mostrou que tática e gestão andam juntas. O troféu do Manager Pro é seu!"
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/20 uppercase tracking-widest active:scale-95"
          >
            Voltar para a Liga
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChampionModal;
