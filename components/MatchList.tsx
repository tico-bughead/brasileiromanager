
import React, { useState } from 'react';
import { Match, Team } from '../types';

interface Props {
  matches: Match[];
  teams: Team[];
  onUpdateScore: (matchId: string, homeScore: number, awayScore: number) => void;
  onUpdateEarnings: (matchId: string, homeEarnings: number, awayEarnings: number) => void;
  onProcessBudgets: () => void;
  onShowResults: () => void;
}

const MatchList: React.FC<Props> = ({ matches, teams, onUpdateScore, onUpdateEarnings, onProcessBudgets, onShowResults }) => {
  const [selectedRound, setSelectedRound] = useState(1);
  const totalRounds = Math.max(...matches.map(m => m.round), 1);
  const filteredMatches = matches.filter(m => m.round === selectedRound);
  const isLastRound = selectedRound === totalRounds;

  const getTeam = (id: string) => teams.find(t => t.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700 overflow-x-auto custom-scrollbar gap-2">
        <div className="flex gap-2">
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
            <button
              key={round}
              onClick={() => setSelectedRound(round)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all min-w-[60px] ${
                selectedRound === round 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
              }`}
            >
              R{round}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map(match => {
          const home = getTeam(match.homeId);
          const away = getTeam(match.awayId);

          return (
            <div key={match.id} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl flex flex-col gap-4 hover:border-blue-500/30 transition-all group animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 text-right">
                  <div className="font-black text-white group-hover:text-blue-400 transition-colors uppercase truncate text-sm md:text-base">{home?.name}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{home?.isHuman ? `👤 ${home.playerName}` : '🤖 AI'}</div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={match.homeScore ?? ''}
                    onChange={(e) => onUpdateScore(match.id, parseInt(e.target.value) || 0, match.awayScore ?? 0)}
                    placeholder="0"
                    className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 border border-slate-700 rounded-xl text-center font-black text-xl md:text-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all"
                  />
                  <span className="text-slate-600 font-black text-lg">X</span>
                  <input
                    type="number"
                    min="0"
                    value={match.awayScore ?? ''}
                    onChange={(e) => onUpdateScore(match.id, match.homeScore ?? 0, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 border border-slate-700 rounded-xl text-center font-black text-xl md:text-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all"
                  />
                </div>

                <div className="flex-1 text-left">
                  <div className="font-black text-white group-hover:text-blue-400 transition-colors uppercase truncate text-sm md:text-base">{away?.name}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{away?.isHuman ? `👤 ${away.playerName}` : '🤖 AI'}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50 flex flex-col gap-3">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  <span>Receita Adicional (Bilheteria/Prêmios)</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-[10px]">R$</span>
                    <input
                      type="number"
                      value={match.homeEarnings || ''}
                      placeholder="Ganhos Casa"
                      onChange={(e) => onUpdateEarnings(match.id, parseInt(e.target.value) || 0, match.awayEarnings || 0)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg pl-7 pr-2 py-2 text-[11px] font-bold text-emerald-400 focus:ring-1 focus:ring-emerald-500 outline-none placeholder:text-slate-700"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-[10px]">R$</span>
                    <input
                      type="number"
                      value={match.awayEarnings || ''}
                      placeholder="Ganhos Fora"
                      onChange={(e) => onUpdateEarnings(match.id, match.homeEarnings || 0, parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg pl-7 pr-2 py-2 text-[11px] font-bold text-emerald-400 focus:ring-1 focus:ring-emerald-500 outline-none placeholder:text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900/50 border border-slate-700 border-dashed rounded-3xl p-8 mt-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center">
          <h4 className="text-white font-black text-lg mb-1 uppercase tracking-tight">Fim da Rodada {selectedRound}</h4>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Ações pendentes para esta etapa</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <button
            onClick={onProcessBudgets}
            className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-emerald-400 font-black py-4 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group"
          >
            <span className="text-xl group-hover:rotate-12 transition-transform">💰</span>
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest leading-none">Atualizar Teto</p>
              <p className="text-[10px] text-slate-500 font-bold">Processar Balanço Mensal</p>
            </div>
          </button>

          {isLastRound && (
            <button
              onClick={onShowResults}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 animate-pulse"
            >
              <span className="text-xl">🏆</span>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest leading-none">Resultados</p>
                <p className="text-[10px] text-white/50 font-bold">Mostrar Campeão</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchList;
