
import React, { useState } from 'react';
import { Match, Team } from '../types';

interface Props {
  matches: Match[];
  teams: Team[];
  onUpdateScore: (matchId: string, homeScore: number, awayScore: number) => void;
  onShowResults: () => void;
}

const MatchList: React.FC<Props> = ({ matches, teams, onUpdateScore, onShowResults }) => {
  const [selectedRound, setSelectedRound] = useState(1);
  const totalRounds = Math.max(...matches.map(m => m.round), 1);
  const filteredMatches = matches.filter(m => m.round === selectedRound);
  const isLastRound = selectedRound === totalRounds;

  const getTeam = (id: string) => teams.find(t => t.id === id);
  const allPlayedInRound = filteredMatches.every(m => m.homeScore !== null && m.awayScore !== null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-slate-700 overflow-x-auto custom-scrollbar gap-4">
        <div className="flex gap-2">
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
            <button
              key={round}
              onClick={() => setSelectedRound(round)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all min-w-[70px] ${
                selectedRound === round 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
              }`}
            >
              Rodada {round}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map(match => {
          const home = getTeam(match.homeId);
          const away = getTeam(match.awayId);

          return (
            <div 
              key={match.id} 
              className="bg-slate-800 border-2 border-slate-700 p-8 rounded-[2rem] shadow-xl flex flex-col gap-6 hover:border-blue-500/30 transition-all group animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Home Team */}
                <div className="flex-1 text-right space-y-1">
                  <div className="font-black text-white group-hover:text-blue-400 transition-colors uppercase truncate text-base md:text-lg">{home?.name}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{home?.playerName}</div>
                </div>

                {/* Score inputs */}
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={match.homeScore ?? ''}
                    onChange={(e) => onUpdateScore(match.id, parseInt(e.target.value) || 0, match.awayScore ?? 0)}
                    placeholder="0"
                    className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 border-2 border-slate-700 rounded-2xl text-center font-black text-2xl md:text-3xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all hover:border-slate-600"
                  />
                  <span className="text-slate-600 font-black text-xl">X</span>
                  <input
                    type="number"
                    min="0"
                    value={match.awayScore ?? ''}
                    onChange={(e) => onUpdateScore(match.id, match.homeScore ?? 0, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 border-2 border-slate-700 rounded-2xl text-center font-black text-2xl md:text-3xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all hover:border-slate-600"
                  />
                </div>

                {/* Away Team */}
                <div className="flex-1 text-left space-y-1">
                  <div className="font-black text-white group-hover:text-blue-400 transition-colors uppercase truncate text-base md:text-lg">{away?.name}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{away?.playerName}</div>
                </div>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{home?.stadium.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900/50 border-2 border-slate-700 border-dashed rounded-[3rem] p-10 mt-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center">
          <h4 className="text-white font-black text-2xl mb-2 uppercase tracking-tight italic">Status da Temporada</h4>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            {allPlayedInRound ? 'Rodada finalizada com sucesso!' : 'Aguardando o apito final em todos os campos...'}
          </p>
        </div>

        {isLastRound && allPlayedInRound && (
          <button
            onClick={onShowResults}
            className="w-full max-w-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-4 animate-pulse active:scale-95"
          >
            <span className="text-2xl">🏆</span>
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest leading-none font-black">Encerrar Campeonato</p>
              <p className="text-[10px] text-white/70 font-bold">Ver o grande campeão</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchList;
