
import React, { useState } from 'react';
import { Match, Team, TournamentType } from '../types';

interface Props {
  matches: Match[];
  teams: Team[];
  onUpdateScore: (matchId: string, homeScore: number, awayScore: number) => void;
  onShowResults: () => void;
  tournamentType?: TournamentType;
}

const MatchList: React.FC<Props> = ({ matches, teams, onUpdateScore, onShowResults, tournamentType }) => {
  const [selectedRound, setSelectedRound] = useState(1);
  const totalRounds = Math.max(...matches.map(m => m.round), 1);
  const filteredMatches = matches.filter(m => m.round === selectedRound);
  const isLastRound = selectedRound === totalRounds;

  const getTeam = (id: string) => teams.find(t => t.id === id);
  const allPlayedTotal = matches.every(m => m.homeScore !== null && m.awayScore !== null);

  const getRoundLabel = (round: number) => {
    if (tournamentType === 'cup') {
      return round === 1 ? 'IDA' : 'VOLTA';
    }
    return `Rodada ${round}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-3xl border border-slate-700 overflow-x-auto custom-scrollbar gap-4">
        <div className="flex gap-2">
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
            <button
              key={round}
              onClick={() => setSelectedRound(round)}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all min-w-[120px] border ${
                selectedRound === round 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-500/20' 
                  : 'bg-slate-900/50 text-slate-500 border-slate-700 hover:text-white hover:border-slate-500'
              }`}
            >
              {getRoundLabel(round)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMatches.map(match => {
          const home = getTeam(match.homeId);
          const away = getTeam(match.awayId);
          if (!home || !away) return null;

          return (
            <div key={match.id} className="bg-slate-800/80 rounded-[2.5rem] p-8 border border-slate-700 shadow-2xl group hover:border-blue-500/30 transition-all flex flex-col items-center">
              {match.stage && (
                <div className="text-[9px] text-blue-500 font-black uppercase tracking-[0.3em] mb-6 border border-blue-500/20 px-4 py-1 rounded-full bg-blue-500/5">
                  {match.stage}
                </div>
              )}
              <div className="flex items-center justify-between gap-6 w-full">
                <div className="flex-1 flex flex-col items-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white shadow-xl transform group-hover:scale-110 transition-all overflow-hidden border-2 border-slate-700" 
                    style={{ backgroundColor: home.color }}
                  >
                    {home.logoUrl ? <img src={home.logoUrl} className="w-full h-full object-cover" /> : home.name[0]}
                  </div>
                  <span className="text-sm font-black text-white text-center uppercase tracking-tighter max-w-[100px] truncate">{home.name}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <input 
                    type="number" min="0" placeholder="0" 
                    value={match.homeScore === null ? '' : match.homeScore} 
                    onChange={(e) => onUpdateScore(match.id, parseInt(e.target.value) || 0, match.awayScore || 0)} 
                    className="w-16 h-16 bg-slate-900 border-2 border-slate-700 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-blue-500 transition-all shadow-inner" 
                  />
                  <span className="text-slate-600 font-black text-xl">VS</span>
                  <input 
                    type="number" min="0" placeholder="0" 
                    value={match.awayScore === null ? '' : match.awayScore} 
                    onChange={(e) => onUpdateScore(match.id, match.homeScore || 0, parseInt(e.target.value) || 0)} 
                    className="w-16 h-16 bg-slate-900 border-2 border-slate-700 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-blue-500 transition-all shadow-inner" 
                  />
                </div>

                <div className="flex-1 flex flex-col items-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white shadow-xl transform group-hover:scale-110 transition-all overflow-hidden border-2 border-slate-700" 
                    style={{ backgroundColor: away.color }}
                  >
                    {away.logoUrl ? <img src={away.logoUrl} className="w-full h-full object-cover" /> : away.name[0]}
                  </div>
                  <span className="text-sm font-black text-white text-center uppercase tracking-tighter max-w-[100px] truncate">{away.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isLastRound && allPlayedTotal && (
        <div className="pt-12 flex justify-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <button 
            onClick={onShowResults} 
            className="px-16 py-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-3xl uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-4"
          >
            Encerrar e Ver Campeão 🏆
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchList;
