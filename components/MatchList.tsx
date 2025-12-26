
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
      <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-slate-700 overflow-x-auto custom-scrollbar gap-4">
        <div className="flex gap-2">
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
            <button
              key={round}
              onClick={() => setSelectedRound(round)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all min-w-[100px] border ${
                selectedRound === round 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
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
            <div key={match.id} className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl group hover:border-blue-500/30 transition-all">
              {match.stage && (
                <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4 text-center">
                  {match.stage}
                </div>
              )}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg transform group-hover:scale-110 transition-transform" style={{ backgroundColor: home.color }}>{home.name[0]}</div>
                  <span className="text-sm font-black text-white text-center uppercase tracking-tight">{home.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="number" min="0" placeholder="0" value={match.homeScore === null ? '' : match.homeScore} onChange={(e) => onUpdateScore(match.id, parseInt(e.target.value) || 0, match.awayScore || 0)} className="w-14 h-14 bg-slate-900 border-2 border-slate-700 rounded-xl text-center text-xl font-black text-white outline-none focus:border-blue-500 transition-all" />
                  <span className="text-slate-600 font-black">X</span>
                  <input type="number" min="0" placeholder="0" value={match.awayScore === null ? '' : match.awayScore} onChange={(e) => onUpdateScore(match.id, match.homeScore || 0, parseInt(e.target.value) || 0)} className="w-14 h-14 bg-slate-900 border-2 border-slate-700 rounded-xl text-center text-xl font-black text-white outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg transform group-hover:scale-110 transition-transform" style={{ backgroundColor: away.color }}>{away.name[0]}</div>
                  <span className="text-sm font-black text-white text-center uppercase tracking-tight">{away.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isLastRound && allPlayedTotal && tournamentType === 'league' && (
        <div className="pt-8 flex justify-center">
          <button onClick={onShowResults} className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all">Ver Resultado Final 🏆</button>
        </div>
      )}
    </div>
  );
};

export default MatchList;
