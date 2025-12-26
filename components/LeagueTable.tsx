
import React from 'react';
import { StandingRow, Team } from '../types';

interface Props {
  standings: StandingRow[];
  teams?: Team[];
}

const LeagueTable: React.FC<Props> = ({ standings, teams = [] }) => {
  const getLogo = (id: string) => teams.find(t => t.id === id)?.logoUrl;
  const getColor = (id: string) => teams.find(t => t.id === id)?.color || '#3b82f6';

  return (
    <div className="bg-slate-800/50 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl animate-in fade-in duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 text-[10px] font-black uppercase tracking-wider">
              <th className="px-6 py-4">Posição</th>
              <th className="px-6 py-4">Clube</th>
              <th className="px-6 py-4 text-center">P</th>
              <th className="px-6 py-4 text-center">J</th>
              <th className="px-6 py-4 text-center">V</th>
              <th className="px-6 py-4 text-center">SG</th>
              <th className="px-6 py-4 text-center hidden md:table-cell">Forma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {standings.map((row, index) => (
              <tr 
                key={row.teamId} 
                className={`hover:bg-slate-700/30 transition-colors ${index === 0 ? 'bg-blue-500/5' : ''}`}
              >
                <td className="px-6 py-5 font-black text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className={`w-1 h-8 rounded-full ${index === 0 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : index >= 4 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-600'}`}></span>
                    <span 
                      className="inline-block animate-soft-pulse-load" 
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {index + 1}º
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-xl overflow-hidden shadow-lg flex items-center justify-center text-white font-black text-xs border border-slate-700 transition-transform hover:scale-110"
                      style={{ backgroundColor: getColor(row.teamId) }}
                    >
                      {getLogo(row.teamId) ? <img src={getLogo(row.teamId)} className="w-full h-full object-cover" alt={row.teamName} /> : row.teamName[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white uppercase tracking-tighter">
                        {row.teamName}
                      </span>
                      {row.isHuman && <span className="text-[8px] font-black text-blue-400 tracking-widest">HUMANO</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-black text-white text-lg">{row.points}</td>
                <td className="px-6 py-5 text-center text-slate-400 font-bold">{row.played}</td>
                <td className="px-6 py-5 text-center text-slate-400 font-bold">{row.won}</td>
                <td className="px-6 py-5 text-center font-black text-slate-200">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                <td className="px-6 py-5 text-center hidden md:table-cell">
                  <div className="flex gap-1 justify-center">
                    {row.lastFive.map((res, i) => (
                      <span 
                        key={i} 
                        className={`w-6 h-6 flex items-center justify-center rounded-lg text-[9px] font-black transition-all hover:scale-110 ${
                          res === 'W' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 
                          res === 'D' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' : 
                          res === 'L' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'bg-slate-700/50'
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-slate-900/30 text-[9px] font-black text-slate-600 uppercase tracking-widest flex flex-wrap gap-8 border-t border-slate-700/50">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span> Campeão / Libertadores</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-600"></span> Sul-Americana</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span> Rebaixamento</div>
      </div>
    </div>
  );
};

export default LeagueTable;