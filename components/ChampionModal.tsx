
import React from 'react';
import { StandingRow, Team } from '../types';

interface Props {
  champion: StandingRow | undefined;
  teamDetails: Team | undefined;
  onClose: () => void;
  type?: 'league' | 'cup';
}

const ChampionModal: React.FC<Props> = ({ champion, teamDetails, onClose, type = 'league' }) => {
  if (!champion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative max-w-xl w-full bg-slate-900 border-4 border-amber-500/30 rounded-[3.5rem] p-10 shadow-[0_0_100px_rgba(245,158,11,0.2)] overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200"></div>
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]"></div>

        <div className="relative flex flex-col items-center text-center">
          <div className="text-8xl mb-6 animate-bounce drop-shadow-[0_10px_20px_rgba(245,158,11,0.5)]">🏆</div>
          <h2 className="text-amber-500 font-black text-sm uppercase tracking-[0.5em] mb-4">
            {type === 'league' ? 'Campeão da Temporada' : 'Ganhador da Copa'}
          </h2>

          <div 
            className="w-32 h-32 rounded-[2rem] shadow-2xl overflow-hidden border-4 border-slate-800 mb-6 bg-slate-800 flex items-center justify-center text-5xl font-black text-white"
            style={{ backgroundColor: teamDetails?.color }}
          >
            {teamDetails?.logoUrl ? <img src={teamDetails.logoUrl} className="w-full h-full object-cover" /> : teamDetails?.name[0]}
          </div>

          <h3 className="text-5xl font-black text-white leading-none mb-2 uppercase tracking-tighter italic">
            {champion.teamName}
          </h3>
          <p className="text-slate-400 font-bold text-lg mb-10">Técnico: {teamDetails?.playerName || 'IA'}</p>

          <div className="grid grid-cols-3 gap-6 w-full mb-10">
            <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700 shadow-inner">
              <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Jogos</p>
              <p className="text-2xl font-black text-white">{champion.played}</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700 shadow-inner">
              <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Gols Pro</p>
              <p className="text-2xl font-black text-white">{champion.gf}</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700 shadow-inner">
              <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Saldo</p>
              <p className="text-2xl font-black text-white">{champion.gd}</p>
            </div>
          </div>

          <p className="text-slate-300 text-base italic mb-10 leading-relaxed max-w-sm">
            "Uma jornada inesquecível coroada com glória eterna. O nome de {champion.teamName} está gravado na história!"
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black py-6 rounded-3xl transition-all shadow-2xl shadow-amber-500/30 uppercase tracking-[0.2em] active:scale-95 text-sm"
          >
            Fechar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChampionModal;
